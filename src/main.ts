import useConfig from './hooks/useConfig'
import notify from './services/notifier'
import streamersController from './useCases/streamersController'
import shutdown from './useCases/shutdown'

export default async function main(firstTime?: boolean) : Promise<unknown> {
  const config = useConfig()

  if (config.deactivate) {
    await notify('Desativando...',
      'Usar a opção [deactivate] faz com que o serviço da Twitch-Watcher não rode, caso queria mudar, passe como false ou retire ela de twitch.json')

    process.exit(0)
  }

  const configStreamers : string[] = []

  config.streamers.forEach((streamer) => {
    if (streamer.level <= config.level) configStreamers.push(streamer.username.toLowerCase())
  })

  if (configStreamers.length <= 0) {
    return notify('Sem streamers para verificar!',
      `Você não passou nenhum streamer no nível ${config.level}, atualize seu arquivo de configuração. Parando serviço...`)
  }

  const {
    closedStreamers,
    openStreamers,
    newStreamers,
  } = await streamersController(configStreamers)

  if (newStreamers && newStreamers.length > 0) {
    if (newStreamers.length === 1) {
      notify('Alguém abriu a live!!!', `${newStreamers.toString()} abriu a live! Aproveite :)`)
    } else {
      notify('Alguns streamers abriram a live!!!',
        `Streamers que ficaram on: ${newStreamers.join(', ')}`)
    }
  }

  if (closedStreamers && closedStreamers.length > 0) {
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
        return notify('Sem streamers para verificar!',
          'Você ativou a opção para desligar quando acabarem as lives mas nenhuma live está on.')
      }

      await shutdown()
    }
  }
}
