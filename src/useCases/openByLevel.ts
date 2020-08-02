import useConfig from '../hooks/useConfig'
import urlByLevel from '../static/urlByLevel'
import openArray from './openArray'
import openOnMulti from './openOnMulti'
import logger from '../services/logger'

export default async function openByLevel(ids: string[],
  openStreamers?: string[]) : Promise<void> {
  logger.info('[useCases/openByLevel]: getting config from useConfig')

  const config = useConfig()

  logger.info(`[useCases/openByLevel]: switch config.level (${config.level})`)

  switch (config.level) {
    case 0:
      await openArray(ids, config.url || urlByLevel[0])
      break
    case 1:
      if (config.url) {
        await openArray(ids, config.url)
      } else {
        await openArray(ids, urlByLevel[1])
        await openArray(ids, urlByLevel[0])
      }
      break
    case 2:
      if (config.url) {
        await openArray(ids, config.url)
      } else {
        await openOnMulti(ids, openStreamers)
      }
      break
    default:
      await openArray(ids, config.url || urlByLevel[3])
      break
  }
}
