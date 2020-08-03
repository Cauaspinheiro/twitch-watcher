// TODO: DOCUMENT EACH PROPERTY

export interface IConfig {
  streamers: Streamer[]
  level: number
  twitch_api: TwitchApi
  stream_elements_api?: StreamElementsApi
  deactivate: boolean
  url: string
  notify: boolean
  shutDown: boolean
  restart: boolean
  getPoints: boolean
}

interface TwitchApi {
  twitch_id: string
  twitch_secret: string
  jwt: string
  repeatEachMs: number
}

interface StreamElementsApi {
  user: string
  jwt: string
  repeatEachMs: number
}

interface Streamer {
  username: string
  level: number
  streamElementsId?: string
}
