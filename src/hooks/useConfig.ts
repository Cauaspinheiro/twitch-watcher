import cache from '../services/nodeCache'
import { IConfig } from '../entities/Config'
import read from '../services/fs/read'

export default function useConfig() : IConfig {
  const config : IConfig | undefined = cache.get('twitch-config')

  const filePath = cache.get<string>('configPath')

  if (!config) {
    if (filePath) {
      return read(filePath)
    }

    console.log(config)

    throw new Error('CONFIG NOT FOUND')
  }

  return config
}
