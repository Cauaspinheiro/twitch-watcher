import cache from '../services/nodeCache'
import { IConfig } from '../entities/Config'
import read from '../services/fs/read'
import logger from '../services/logger'

export default function useConfig() : IConfig {
  const config : IConfig | undefined = cache.get('twitch-config')

  const filePath = cache.get<string>('configPath')

  if (!config) {
    if (filePath) {
      logger.info('[hooks/useConfig]: config not found from cache, reading from file')

      return read(filePath)
    }

    logger.error('[hooks/useConfig]: config not found')
    throw new Error('CONFIG NOT FOUND')
  }

  logger.info('[hooks/useConfig]: config found from cache')

  return config
}
