import open from 'open'
import logger from '../services/logger'

export default async function openArray(streamers: string[], url: string) {
  const promises = streamers.map((streamer) => open(url.replace('${streamer}', streamer)))

  logger.info(`[useCases/openArray]: opening ${streamers} in ${url}`)

  return Promise.all(promises)
}
