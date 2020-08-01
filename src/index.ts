import path from 'path'
import os from 'os'
import watch from './services/fs/watch'
import repeat from './useCases/repeat'
import logger from './services/logger'

let configPath : string

if (process.env.NODE_ENV === 'dev') {
  configPath = path.resolve(__dirname, '..', 'config.json')

  logger.info('[index]: Twitch Watcher started at dev mode')
} else {
  configPath = path.resolve('/', 'users', os.userInfo().username,
    'desktop', 'twitch.json')

  logger.info('[index]: Twitch Watcher started at prod mode')
}

watch(configPath, repeat)
