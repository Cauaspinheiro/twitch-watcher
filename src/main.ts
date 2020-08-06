import useConfig from './hooks/useConfig'
import notify from './services/notifier'
import streamersController from './controllers/streamersController'
import shutdown from './useCases/shutdown'
import logger from './services/logger'
import notifyMessages from './static/notifyMessages'
import restart from './useCases/restart'

export default async function main(firstTime?: boolean) : Promise<unknown> {
  const config = useConfig()

  if (config.restart) {
    logger.info('[main]: config.restart == true, restarting...')

    await notify(notifyMessages.restart.title, notifyMessages.restart.message)

    return restart()
  }

  if (config.deactivate) {
    logger.info('[main]: config.deactivate == true, deactivating...')

    await notify(notifyMessages.deactivate.title, notifyMessages.deactivate.message)

    process.exit(0)
  }

  if (config.shutDown && config.log_shutDown) {
    logger.info('[main]: config.shutDown == true')

    await notify(notifyMessages.shutDownOpts.title, notifyMessages.shutDownOpts.message)
  }

  const configStreamers : string[] = []

  config.streamers.forEach((streamer) => {
    if (streamer.level <= config.level) configStreamers.push(streamer.username.toLowerCase())
  })

  if (configStreamers.length <= 0) {
    logger.warn('[main]: no streamers if level <= config.level')

    return notify(notifyMessages.configStreamers.title,
      `Você não passou nenhum streamer no nível ${config.level}, atualize seu arquivo de configuração. Parando serviço...`)
  }

  logger.info(`[main]: streamers in config <= config.level: ${configStreamers}`)

  const {
    closedStreamers,
    openStreamers,
    newStreamers,
  } = await streamersController(configStreamers)

  if (newStreamers && newStreamers.length > 0) {
    logger.info(`[main]: notifying new streamers: ${newStreamers}`)

    if (newStreamers.length === 1) {
      notify(notifyMessages.newStreamer.title,
        `${newStreamers.toString()} abriu a live! Aproveite :)`)
    } else {
      notify(notifyMessages.newStreamers.title,
        `Streamers que ficaram on: ${newStreamers.join(', ')}`)
    }
  }

  if (closedStreamers && closedStreamers.length > 0) {
    logger.info(`[main]: notifying closed streamers: ${closedStreamers}`)

    if (closedStreamers.length === 1) {
      notify(notifyMessages.closedStreamer.title,
        `Parando de verificar ${closedStreamers.toString()} porque ele fechou a live ou não está mais no nível para ser verificado`)
    } else {
      notify(notifyMessages.closedStreamers.title,
        `${closedStreamers.join(', ')} ficaram off ou pararam de estar no nível para ser verificados`)
    }
  }

  if (openStreamers && openStreamers.length <= 0) {
    if (config.shutDown) {
      if (firstTime) {
        logger.warn('[main]: no streamers to verify for shutdown')

        return notify(notifyMessages.shutDownFn.title,
          notifyMessages.shutDownFn.message)
      }

      await shutdown()
    }
  }

  return {} as Promise<unknown>
}
