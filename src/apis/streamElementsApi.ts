import axios from 'axios'
import logger from '../services/logger'
import useConfig from '../hooks/useConfig'
import cache from '../services/nodeCache'
import { IStreamersController } from '../controllers/streamersController'

interface StreamElementsResBody {
  channel: string
  points: number
}
interface StreamElementsRes {
  data: StreamElementsResBody
  headers: {
    'x-ratelimit-remaining': number
  }
}

interface StreamersId {
  name: string
  id: string
}

interface StreamersPoints {
  name: string
  points: number
}

export default async function getPoints() : Promise<StreamersPoints[] | undefined> {
  const config = useConfig()

  if (!config.stream_elements_api?.jwt || !config.stream_elements_api?.user) {
    logger.warn('[/apis/streamElementsApi]: Config for streamElementsApi not found')

    return
  }

  logger.info('[/apis/streamElementsApi]: Setting axios api with headers: authorization')

  const api = axios.create({ baseURL: 'https://api.streamelements.com/kappa/v2/points' })

  api.defaults.headers.authorization = `Bearer ${config.stream_elements_api.jwt}`

  const streamers : StreamersId[] = []

  const openStreamers = cache.get<IStreamersController>('streamersController')?.openStreamers

  if (!openStreamers || openStreamers.length <= 0) return

  openStreamers.forEach((openStreamer) => {
    config.streamers.forEach((streamer) => {
      if (openStreamer === streamer.username) {
        if (streamer.streamElementsId) {
          const data : StreamersId = {
            name: streamer.username,
            id: streamer.streamElementsId,
          }

          streamers.push(data)
        }
      }
    })
  })

  if (streamers.length < 1) {
    logger.warn('[/apis/streamElementsApi]: no streamElementsId found')

    return
  }

  logger.info(`[/apis/streamElementsApi]: streamElementsId found: ${streamers}`)

  try {
    logger.info('[/apis/streamElementsApi]: getting streamElements points from api')

    const promises = streamers.map((streamer) => {
      const { id } = streamer

      const { user } = config.stream_elements_api!

      return api.get<StreamElementsResBody>(`/${id}/${user}`)
    })

    const res = await Promise.all(promises)

    const points : StreamElementsResBody[] = []

    res.forEach((response: StreamElementsRes) => {
      const data = {
        channel: response.data.channel,
        points: response.data.points,
      }

      points.push(data)
    })

    const { headers } : StreamElementsRes = res[res.length - 1]

    logger.info(`[/apis/streamElementsApi]: ratelimit-remaining: ${headers['x-ratelimit-remaining']}`)

    const streamersPoints : StreamersPoints[] = []

    points.forEach((point) => {
      streamers.forEach((streamer) => {
        if (streamer.id === point.channel) {
          const data : StreamersPoints = {
            name: streamer.name,
            points: point.points,
          }

          streamersPoints.push(data)
        }
      })
    })

    logger.info(`[/apis/streamElementsApi]: streamersPoints found: ${streamersPoints}`)

    return streamersPoints
  } catch (error) {
    logger.error(`[/apis/streamElementsApi]: error: ${JSON.stringify(error)}`)
  }
}
