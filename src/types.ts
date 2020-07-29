export interface Config {
  streamers: StreamerLevel[],
  level: Level
  twitch_id: string,
  twitch_secret: string,
  jwt: string,
  deactivate: boolean
  url: string
  openOnMulti: boolean
  repeatEachMs: number
  notify: boolean
  updated: boolean
  shutDown: boolean
}

interface StreamerLevel {
  username: string,
  level: Level
}

type Level = 0 | 1 | 2 | 3

interface Streamer {
  'user_name': string,
}

export type StreamerReq = {data: Array<Streamer> }
