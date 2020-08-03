import getPoints from '../apis/streamElementsApi'
import notify from '../services/notifier'
import notifyMessages from '../static/notifyMessages'
import logger from '../services/logger'

export default async function pointsController() {
  const streamersPoints = await getPoints()

  if (!streamersPoints) return

  let message = ''

  streamersPoints.forEach((streamer) => {
    message += `${streamer.name}: ${streamer.points}\n`
  })

  logger.info(`[/controllers/pointsController]: streamersPoints ${streamersPoints}`)

  return notify(notifyMessages.points.title, message)
}
