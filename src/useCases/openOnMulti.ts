import open from 'open'
import logger from '../services/logger'

export default async function openOnMulti(newStreamers: string[],
  openStreamers?: string[]) : Promise<void> {
  if (openStreamers && openStreamers.length >= 1) {
    const filteredStreamers = newStreamers.filter((streamer) => {
      if (!openStreamers.includes(streamer)) return streamer
    })

    if (filteredStreamers.length <= 0) return

    const streamers = [...newStreamers, ...openStreamers]

    let url = 'https://www.multitwitch.tv'

    streamers.forEach((streamer) => {
      url = `${url}/${streamer}`
    })

    logger.info(`[useCases/openArray]: opening ${streamers} in multitwitch`)

    await open(url)
  } else {
    let url = 'https://www.multitwitch.tv'

    newStreamers.forEach((streamer) => {
      url = `${url}/${streamer}`
    })

    logger.info(`[useCases/openArray]: opening ${newStreamers} in multitwitch`)

    await open(url)
  }
}
