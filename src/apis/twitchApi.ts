import axios from 'axios'
import useConfig from '../hooks/useConfig'

interface StreamsReq {
  data: {
    user_name: string
  }[]
}

export default async function getStreamers(streamers: string[]) : Promise<string[] | undefined> {
  const config = useConfig()

  const api = axios.create({ baseURL: 'https://api.twitch.tv/helix' })

  api.defaults.headers.authorization = `Bearer ${config.twitch_api.jwt}`

  api.defaults.headers['client-id'] = config.twitch_api.twitch_id

  console.log(streamers)

  const query = `user_login=${streamers.join('&user_login=')}`

  try {
    const { data: res } = await api.get<StreamsReq>(`/streams?${query}`)

    const usernames = res.data?.map((streamer) => streamer.user_name.toLowerCase())

    return usernames
  } catch (err) {
    return err
  }
}
