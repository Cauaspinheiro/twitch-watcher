import cache from '../services/nodeCache'
import getStreamers from '../apis/twitchApi'
import openByLevel from './openByLevel'

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

  const pastController = cache.get<IStreamersController>('streamersController')

  if (pastController) {
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

    cache.set('streamersController', controller)

    return { ...controller, newStreamers }
  }

  await openByLevel(liveStreamers as string[])

  const controller : IStreamersController = { closedStreamers: [], openStreamers: liveStreamers }

  cache.set('streamersController', controller)

  return { ...controller, newStreamers: liveStreamers }
}
