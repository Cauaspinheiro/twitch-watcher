import Powershell from 'node-powershell'
import { Config, StreamerReq } from './types'
import api from './services/axios'

export default function fn(json: Config) : void {
  const ps = new Powershell({})

  const streamersOpens : string[] = []

  async function openArray(streamers: string[]) {
    streamers.forEach(async (streamer) => {
      if (!streamersOpens.includes(streamer)) {
        await ps.addCommand(`start msedge https://www.twitch.tv/${streamer}`)
        streamersOpens.push(streamer)
      }
    })

    await ps.invoke()
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

      await openArray(ids)
    } else {
      await ps.addCommand('taskkill /IM msedge.exe /F')

      await ps.invoke().catch((error) => error)
    }
  }

  request()

  setInterval(() => request(), 1000 * 60 * 5)
}
