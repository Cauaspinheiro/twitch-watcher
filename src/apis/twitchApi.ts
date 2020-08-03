import axios from 'axios'
import useConfig from '../hooks/useConfig'
import logger from '../services/logger'

interface StreamsReq {
  data: {
    user_name: string
  }[]
}

interface Response {
  data: StreamsReq
  headers: StreamsHeaders
}

interface StreamsHeaders {
  'ratelimit-remaining': number
}

export default async function getStreamers(streamers: string[]) : Promise<string[] | undefined> {
  const config = useConfig()

  const api = axios.create({ baseURL: 'https://api.twitch.tv/helix' })

  api.defaults.headers.authorization = `Bearer ${config.twitch_api.jwt}`

  api.defaults.headers['client-id'] = config.twitch_api.twitch_id

  const query = `user_login=${streamers.join('&user_login=')}`

  try {
    logger.info(`[/apis/twitchApi]: requesting twitch api in /streams?${query} endpoint`)

    const { data: res, headers } : Response = await api.get(`/streams?${query}`)

    const usernames = res.data?.map((streamer) => streamer.user_name.toLowerCase())

    logger.info(`[/apis/twitchApi]: ratelimit-remaining: ${headers['ratelimit-remaining']}`)

    return usernames
  } catch (err) {
    return err
  }
}
