import watchFile from 'node-watch'
import read from './read'

export default function watch(configPath: string, callback: () => () => unknown)
 : void {
  let config = read(configPath)

  let dispose = callback()

  watchFile(configPath, async (evt, name) => {
    if (evt === 'remove') return

    const pastConfig = config

    config = read(configPath)

    if (JSON.stringify(pastConfig) !== JSON.stringify(config)) {
      if (dispose) await dispose()

      dispose = callback()
    }
  })
}
