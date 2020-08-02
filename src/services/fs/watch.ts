import watchFile from 'node-watch'
import read from './read'
import logger from '../logger'

export default function watch(configPath: string, callback: () => () => unknown)
 : void {
  let config = read(configPath)

  let dispose = callback()

  logger.info(`[services/fs/watch]: Watching file ${configPath}`)

  watchFile(configPath, async (evt, name) => {
    if (evt === 'remove') return

    logger.info('[services/fs/watch]: WatchFile callback called')

    const pastConfig = config

    logger.info(`[services/fs/watch]: Reading ${configPath}`)

    config = read(configPath)

    if (JSON.stringify(pastConfig) !== JSON.stringify(config)) {
      logger.info(`[services/fs/watch]: ${configPath} changed`)

      logger.info(`[services/fs/watch]: Past config: ${JSON.stringify(pastConfig)} New Config: ${JSON.stringify(config)}`)

      logger.info('[services/fs/watch]: Calling dispose function')

      if (dispose) await dispose()

      logger.info('[services/fs/watch]: Calling Fn')

      dispose = callback()
    }
  })
}
