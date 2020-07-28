/* eslint-disable no-template-curly-in-string */
import open from 'open'
import { Config, StreamerReq } from './types'
import api from './services/axios'
import isArraysEqual from './utils/isArraysEqual'
import notify from './notifier'

export default function listenToApi(id: string, json: Config) : () => Promise<void> {
  let openStreamers : string[] = []

  async function openArray(streamers : string[]) {
    const newStreamers = streamers.filter((streamer) => {
      if (!openStreamers.includes(streamer)) return streamer
    })

    streamers.forEach(async (streamer) => {
      if (!openStreamers.includes(streamer)) {
        const url = json.url?.replace('${streamer}', streamer) || `https://www.twitch.tv/${streamer}`

        await open(url)
        openStreamers.push(streamer)
      }
    })

    if (newStreamers.length > 0) {
      if (newStreamers.length === 1) {
        notify('Novo streamer on!!!', `${newStreamers.toString()} está online`, json)
      } else {
        notify('Novos streamers on!!!', `Novos streamers: ${newStreamers.join(', ')}`, json)
      }
    }
  }

  async function openOnMulti(streamers : string[]) {
    if (!isArraysEqual(streamers, openStreamers)) {
      const newStreamers = streamers.map((streamer) => {
        if (!openStreamers.includes(streamer)) return streamer

        return undefined
      })

      if (newStreamers.length > 0 && !json.updated) {
        if (newStreamers.length === 1) {
          notify('Novo streamer on!!!', `${newStreamers.toString()} está online`, json)
        } else {
          notify('Novos streamers on!!!', `Novos streamers: ${newStreamers.join(', ')}`, json)
        }
      }

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

      const closedStreamers : string[] = []

      openStreamers = openStreamers.filter((streamer) => {
        if (ids.includes(streamer)) return streamer

        closedStreamers.push(streamer)
      })

      if (closedStreamers.length > 0 && !json.updated) {
        if (closedStreamers.length === 1) {
          notify('Alguém fechou a live...', `${closedStreamers.toString()} fechou a live`, json)
        } else {
          notify('Alguns streamers fecharam a live',
            `Streamers que ficaram off: ${closedStreamers.join(', ')}`, json)
        }
      }

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

  const interval = setInterval(() => request(), json.repeatEachMs || 1000 * 60 * 3)

  async function dispose() {
    clearInterval(interval)
  }

  return dispose
}
