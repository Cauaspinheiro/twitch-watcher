import fs from 'fs'
import { IConfig } from '../../entities/Config'
import cache from '../nodeCache'

export default function read(configPath: string) : IConfig {
  const config = JSON.parse(fs.readFileSync(configPath) as unknown as string) as IConfig

  if (!config) {
    throw new Error('FILE NOT FOUND')
  }

  cache.set('twitch-config', config)

  cache.set('configPath', configPath)

  return config
}
