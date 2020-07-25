/* eslint-disable no-template-curly-in-string */
import Powershell from 'node-powershell'
import open from 'open'
import { Config, StreamerReq } from './types'
import api from './services/axios'

export default function listenToApi(id: string, json: Config) : () => Promise<void> {
  let streamersOpens : string[] = []

  const ps = new Powershell({})

  async function openArray(streamers : string[]) {
    console.log(`${id} has ${streamers}`)

    streamers.forEach(async (streamer) => {
      if (!streamersOpens.includes(streamer)) {
        const url = json.url?.replace('${streamer}', streamer) || `https://www.twitch.tv/${streamer}`

        await open(url)
        streamersOpens.push(streamer)
        console.log(`${id} opening ${streamer}`)
      }
    })
  }

  async function openOnMulti(streamers : string[]) {
    let url = 'https://www.multitwitch.tv'

    streamers.forEach((streamer) => {
      url = `${url}/${streamer}`
    })

    await open(url)
    streamersOpens = streamers
  }

  async function request() {
    const query = `user_login=${json.streamers.join('&user_login=')}`

    console.log(`${id} requesting api`)

    const { data: res } = await api.get<StreamerReq>(`/streams?${query}`, {
      headers: {
        authorization: `Bearer ${json.jwt}`,
        'client-id': json.twitch_id,
      },
    })

    if (res.data.length > 0) {
      const ids = res.data.map((streamer) => streamer.user_name)

      if (json.openOnMulti) {
        openOnMulti(ids)
      } else {
        await openArray(ids)
      }
    } else {
      await ps.addCommand('taskkill /IM msedge.exe /F')

      await ps.invoke().catch((error) => error)
    }
  }

  request()

  const interval = setInterval(() => request(), 1000 * 60 * 5)

  async function dispose() {
    clearInterval(interval)

    await ps.dispose()

    console.log(`${id} disposing`)
  }

  return dispose
}
