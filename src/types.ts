export interface Config {
  streamers: Array<string>,
  twitch_id: string,
  twitch_secret: string,
  jwt: string,
  deactivate: boolean
  url: string
  openOnMulti: boolean
  repeatEachMs: number
}

interface Streamer {
  'user_name': string,
}

export type StreamerReq = {data: Array<Streamer> }
