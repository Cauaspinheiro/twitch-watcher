import fs from 'fs'
import { IConfig } from '../../entities/Config'
import cache from '../nodeCache'
import logger from '../logger'

export default function read(configPath: string) : IConfig {
  logger.info(`[services/fs/read]: Reading file at ${configPath}`)

  const config = JSON.parse(fs.readFileSync(configPath) as unknown as string) as IConfig

  if (!config) {
    logger.error(`[services/fs/read]: CONFIG FILE NOT FOUND - path: ${configPath}`)
    throw new Error('FILE NOT FOUND')
  }

  cache.set('twitch-config', config)

  logger.info('[services/fs/read]: Config file found and set cached to twitch-config')

  cache.set('configPath', configPath)

  logger.info('[services/fs/read]: Config path cached to configPath')

  return config
}
