import useConfig from './hooks/useConfig'
import notify from './services/notifier'
import streamersController from './useCases/streamersController'
import shutdown from './useCases/shutdown'
import logger from './services/logger'

export default async function main(firstTime?: boolean) : Promise<unknown> {
  logger.info('[main]: getting config from hook')

  const config = useConfig()

  if (config.deactivate) {
    logger.info('[main]: config.deactivate == true, deactivating...')

    await notify('Desativando...',
      'Usar a opção [deactivate] faz com que o serviço da Twitch-Watcher não rode, caso queria mudar, passe como false ou retire ela de twitch.json')

    process.exit(0)
  }

  if (config.shutDown) {
    logger.info('[main]: config.shutDown == true')

    await notify('Esperando para desligar...',
      'Usar a opção "shutDown" faz com que o seu PC desligue depois que nenhum streamer está mais em live.')
  }

  const configStreamers : string[] = []

  config.streamers.forEach((streamer) => {
    if (streamer.level <= config.level) configStreamers.push(streamer.username.toLowerCase())
  })

  if (configStreamers.length <= 0) {
    logger.warn('[main]: no streamers if level <= config.level')

    return notify('Sem streamers para verificar!',
      `Você não passou nenhum streamer no nível ${config.level}, atualize seu arquivo de configuração. Parando serviço...`)
  }

  logger.info(`[main]: streamers in config <= config.level: ${configStreamers}`)

  const {
    closedStreamers,
    openStreamers,
    newStreamers,
  } = await streamersController(configStreamers)

  if (newStreamers && newStreamers.length > 0) {
    logger.info('[main]: notifying new streamers')

    if (newStreamers.length === 1) {
      notify('Alguém abriu a live!!!', `${newStreamers.toString()} abriu a live! Aproveite :)`)
    } else {
      notify('Alguns streamers abriram a live!!!',
        `Streamers que ficaram on: ${newStreamers.join(', ')}`)
    }
  }

  if (closedStreamers && closedStreamers.length > 0) {
    logger.info('[main]: notifying closed streamers')

    if (closedStreamers.length === 1) {
      notify('Alguém fechou a live...', `${closedStreamers.toString()} fechou a live`)
    } else {
      notify('Alguns streamers fecharam a live',
        `Streamers que ficaram off: ${closedStreamers.join(', ')}`)
    }
  }

  if (openStreamers && openStreamers.length <= 0) {
    if (config.shutDown) {
      if (firstTime) {
        logger.warn('[main]: no streamers to verify for shutdown')

        return notify('Sem streamers para verificar!',
          'Você ativou a opção para desligar quando acabarem as lives mas nenhuma live está on.')
      }

      await shutdown()
    }
  }
}
