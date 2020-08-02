import cache from '../services/nodeCache'
import getStreamers from '../apis/twitchApi'
import openByLevel from './openByLevel'
import logger from '../services/logger'

interface IStreamersController {
  openStreamers?: string[]
  closedStreamers?: string[]
}

interface IReturns {
  openStreamers?: string[]
  closedStreamers?: string[]
  newStreamers?: string[]
}

export default async function streamersController(ids: string[]) : Promise<IReturns> {
  let openStreamers : string[] | undefined = []
  let closedStreamers
  const newStreamers : string[] = []

  const liveStreamers = await getStreamers(ids)

  logger.info('[useCases/streamersController]: getting pastController from cache')

  const pastController = cache.get<IStreamersController>('streamersController')

  if (pastController) {
    logger.info(`[useCases/streamersController]: pastController was found in cache - ${pastController}`)

    openStreamers = liveStreamers?.filter((streamer) => {
      if (pastController.openStreamers?.includes(streamer.toLowerCase())) {
        return streamer.toLowerCase()
      }

      newStreamers.push(streamer)
    })

    closedStreamers = pastController.openStreamers?.filter((streamer) => {
      if (!liveStreamers?.includes(streamer.toLowerCase())) return streamer
    })

    await openByLevel(newStreamers, openStreamers)

    openStreamers?.push(...newStreamers)

    const controller : IStreamersController = {
      openStreamers,
      closedStreamers,
    }

    logger.info(`[useCases/streamersController]: new controller: ${JSON.stringify(controller)}`)
    logger.info('[useCases/streamersController]: setting streamersController with new controller')

    cache.set('streamersController', controller)

    return { ...controller, newStreamers }
  }

  logger.info('[useCases/streamersController]: no past controller found')

  await openByLevel(liveStreamers as string[])

  const controller : IStreamersController = { closedStreamers: [], openStreamers: liveStreamers }

  logger.info(`[useCases/streamersController]: new controller: ${JSON.stringify(controller)}`)
  logger.info('[useCases/streamersController]: setting streamersController with new controller')

  cache.set('streamersController', controller)

  return { ...controller, newStreamers: liveStreamers }
}
