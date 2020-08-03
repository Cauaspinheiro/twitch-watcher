import getPoints from '../apis/streamElementsApi'
import notify from '../services/notifier'
import notifyMessages from '../static/notifyMessages'

export default async function pointsController() {
  const streamersPoints = await getPoints()

  if (!streamersPoints) return

  let message = ''

  streamersPoints.forEach((streamer) => {
    message += `${streamer.name}: ${streamer.points}\n`
  })

  return notify(notifyMessages.points.title, message)
}
