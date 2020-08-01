import path from 'path'
import os from 'os'
import watch from './services/fs/watch'
import repeat from './useCases/repeat'

let configPath : string

if (process.env.NODE_ENV === 'dev') {
  configPath = path.resolve(__dirname, '..', 'config.json')
} else {
  configPath = path.resolve('/', 'users', os.userInfo().username,
    'desktop', 'twitch.json')
}

watch(configPath, repeat)
