import fs from 'fs'
import cache from '../services/nodeCache'
import logger from '../services/logger'
import useConfig from '../hooks/useConfig'

export default function restart() : void {
  const config = useConfig()

  delete config.restart

  const configPath = cache.get<string>('configPath')

  if (configPath) {
    logger.info('[/useCases/restart]: rewriting config file without config.restart')

    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 2))
  }

  logger.info('[/useCases/restart]: flushing all data')

  cache.flushAll()
}
