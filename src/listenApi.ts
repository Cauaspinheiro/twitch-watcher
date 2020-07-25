import Powershell from 'node-powershell'
import open from 'open'
import { Config, StreamerReq } from './types'
import api from './services/axios'

export default function listenToApi(id: string, json: Config) : () => Promise<void> {
  const streamersOpens : string[] = []

  const ps = new Powershell({})

  async function openArray(streamers : string[]) {
    console.log(`${id} has ${streamers}`)

    streamers.forEach(async (streamer) => {
      if (!streamersOpens.includes(streamer)) {
        await open(`https://www.twitch.tv/${streamer}`)
        streamersOpens.push(streamer)
        console.log(`${id} opening ${streamer}`)
      }
    })
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

      await openArray(ids)
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
