import useConfig from '../hooks/useConfig'
import logger from '../services/logger'
import msToMinutesAndSeconds from '../utils/msToMinutesAndSeconds'
import pointsController from '../controllers/pointsController'

export default function repeatPoints() {
  const config = useConfig()

  if (!config.stream_elements_api) return

  function repeat() {
    const pointsMs = config.stream_elements_api!.repeatEachMs || 1000 * 60 * 10

    logger.info(`[useCases]: Setting interval to run pointsController each ${msToMinutesAndSeconds(pointsMs)} minutes`)

    return setInterval(() => pointsController(), pointsMs)
  }

  if (config.getPoints === true) {
    return repeat()
  }

  if (config.getPoints === undefined && process.env.NODE_ENV !== 'dev') {
    return repeat()
  }
}
