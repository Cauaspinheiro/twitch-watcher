import useConfig from '../hooks/useConfig'

import main from '../main'
import logger from '../services/logger'
import msToMinutesAndSeconds from '../utils/msToMinutesAndSeconds'
import pointsController from '../controllers/pointsController'

export default function repeat() : () => Promise<void> {
  logger.info('[useCases/repeat]: getting config from hook')
  const config = useConfig()

  logger.info('[useCases/repeat]: Running main at first time')

  main(true)

  const ms = config.twitch_api.repeatEachMs || config.shutDown
    ? 1000 * 60 * 10 : 1000 * 60 * 2

  let pointsInterval :NodeJS.Timeout

  if (config.stream_elements_api) {
    const pointsMs = config.stream_elements_api.repeatEachMs || 1000 * 60 * 10

    logger.info(`[useCases]: Setting interval to run pointsController each ${msToMinutesAndSeconds(pointsMs)} minutes`)

    pointsInterval = setInterval(() => pointsController(), pointsMs)
  }

  logger.info(`[useCases]: Setting interval to run main each ${msToMinutesAndSeconds(ms)} minutes`)

  const interval = setInterval(() => main(), ms)

  return async function dispose() {
    logger.info('[useCases/repeat]: Disposing...')

    clearInterval(interval)

    if (pointsInterval) {
      clearInterval(pointsInterval)
    }

    logger.info('[useCases/repeat]: Clearing interval...')
  }
}
