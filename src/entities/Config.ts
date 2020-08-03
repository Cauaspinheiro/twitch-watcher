// TODO: DOCUMENT EACH PROPERTY

export interface IConfig {
  streamers: Streamer[]
  level: number
  twitch_api: {
    twitch_id: string
    twitch_secret: string
    jwt: string
    repeatEachMs: number
  }
  deactivate: boolean
  url: string
  notify: boolean
  shutDown: boolean
  restart: boolean
}

interface Streamer {
  username: string
  level: number
}
