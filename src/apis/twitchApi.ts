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
  'ratelimit-limit': number
  'ratelimit-remaining': number
}

export default async function getStreamers(streamers: string[]) : Promise<string[] | undefined> {
  logger.info('[/apis/twitchApi]: getting config from useConfig')

  const config = useConfig()

  logger.info('[/apis/twitchApi]: Setting axios api with headers authorization and client-id')

  const api = axios.create({ baseURL: 'https://api.twitch.tv/helix' })

  api.defaults.headers.authorization = `Bearer ${config.twitch_api.jwt}`

  api.defaults.headers['client-id'] = config.twitch_api.twitch_id

  const query = `user_login=${streamers.join('&user_login=')}`

  try {
    logger.info(`[/apis/twitchApi]: requesting twitch api in /streams?${query} endpoint`)

    const { data: res, headers } : Response = await api.get(`/streams?${query}`)

    const usernames = res.data?.map((streamer) => streamer.user_name.toLowerCase())

    logger.info(`[/apis/twitchApi]: ratelimit-limit: ${headers['ratelimit-limit']} ratelimit-remaining: ${headers['ratelimit-remaining']}`)

    return usernames
  } catch (err) {
    return err
  }
}
