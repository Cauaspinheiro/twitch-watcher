import useConfig from '../hooks/useConfig'

import main from '../main'
import logger from '../services/logger'
import msToMinutesAndSeconds from '../utils/msToMinutesAndSeconds'

export default function repeat() : () => Promise<void> {
  logger.info('[useCases/repeat]: getting config from hook')
  const config = useConfig()

  logger.info('[useCases/repeat]: Running main at first time')

  main(true)

  const ms = config.twitch_api.repeatEachMs || config.shutDown
    ? 1000 * 60 * 10 : 1000 * 60 * 2

  const interval = setInterval(() => main(), ms)

  logger.info(`[useCases]: Setting interval to run main each ${msToMinutesAndSeconds(ms)} minutes`)

  return async function dispose() {
    logger.info('[useCases/repeat]: Disposing...')

    clearInterval(interval)

    logger.info('[useCases/repeat]: Clearing interval...')
  }
}
