/* eslint-disable no-template-curly-in-string */
import open from 'open'
import { Config, StreamerReq } from './types'
import api from './services/axios'
import isArraysEqual from './utils/isArraysEqual'

export default function listenToApi(id: string, json: Config) : () => Promise<void> {
  let openStreamers : string[] = []

  async function openArray(streamers : string[]) {
    streamers.forEach(async (streamer) => {
      if (!openStreamers.includes(streamer)) {
        const url = json.url?.replace('${streamer}', streamer) || `https://www.twitch.tv/${streamer}`

        await open(url)
        openStreamers.push(streamer)
      }
    })
  }

  async function openOnMulti(streamers : string[]) {
    if (!isArraysEqual(streamers, openStreamers)) {
      let url = 'https://www.multitwitch.tv'

      streamers.forEach((streamer) => {
        url = `${url}/${streamer}`
      })

      await open(url)
      openStreamers = streamers
    }
  }

  async function request() {
    const query = `user_login=${json.streamers.join('&user_login=')}`

    const { data: res } = await api.get<StreamerReq>(`/streams?${query}`, {
      headers: {
        authorization: `Bearer ${json.jwt}`,
        'client-id': json.twitch_id,
      },
    })

    if (res.data.length > 0) {
      const ids = res.data.map((streamer) => streamer.user_name)

      openStreamers = openStreamers.filter((streamer) => {
        if (ids.includes(streamer)) return streamer

        return undefined
      })

      if (json.openOnMulti) {
        openOnMulti(ids)
      } else {
        await openArray(ids)
      }
    } else {
      openStreamers = []
    }
  }

  request()

  const interval = setInterval(() => request(), 1000 * 30)

  async function dispose() {
    clearInterval(interval)
  }

  return dispose
}
