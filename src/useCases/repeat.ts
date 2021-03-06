import useConfig from '../hooks/useConfig'

import main from '../main'
import logger from '../services/logger'
import msToMinutesAndSeconds from '../utils/msToMinutesAndSeconds'
import repeatPoints from './repeatPoints'

export default function repeat() : () => Promise<void> {
  const config = useConfig()

  logger.info('[useCases/repeat]: Running main at first time')

  main(true)

  const ms = config.twitch_api.repeatEachMs || config.shutDown
    ? 1000 * 60 * 10 : 1000 * 60 * 2

  const pointsInterval = repeatPoints()

  logger.info(`[useCases]: Setting interval to run main each ${msToMinutesAndSeconds(ms)} minutes`)

  const interval = setInterval(() => main(), ms)

  return async function dispose() {
    logger.info('[useCases/repeat]: Disposing...')

    clearInterval(interval)

    if (pointsInterval) {
      clearInterval(pointsInterval)
    }
  }
}
