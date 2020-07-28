import fsWatch from 'node-watch'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { Config } from '../types'
import notify from '../notifier'

export default function listen(fn: (config: Config,) => () => unknown) :void {
  let configPath : string

  if (process.env.NODE_ENV === 'dev') {
    configPath = path.resolve(__dirname, '..', '..', 'config.json')
  } else {
    configPath = path.resolve('/', 'users', os.userInfo().username,
      'desktop', 'twitch.json')
  }

  let dispose: () => unknown

  function read() {
    return JSON.parse(fs.readFileSync(configPath) as unknown as string) as Config
  }

  function run(config: Config) {
    dispose = fn(config)

    if (!config.deactivate) {
      if (config.updated) {
        notify('Atualizando Twitch Watcher',
          'Atualizando o Twitch Watcher usando as novas configurações passadas no JSON',
          config)
      } else {
        notify('Abrindo o Twitch Watcher',
          'Verificando se existem streamers on...',
          config)
      }
    }
  }

  let config = read()

  run(config)

  function watch() {
    fsWatch(configPath, async (evt, name) => {
      if (evt === 'remove') return

      const pastConfig = config

      config = read()

      if (JSON.stringify(pastConfig) !== JSON.stringify(config)) {
        await dispose()

        config.updated = true

        run(config)
      }
    })
  }

  watch()
}
