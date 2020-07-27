import faker from 'faker'
import { Config } from './types'
import listenToApi from './listenApi'
import notify from './notifier'

export default function fn(json: Config) : () => Promise<void> {
  if (json.deactivate) {
    notify(
      'Desativando...',
      'Usar a opção [deactivate] faz com que o serviço da Twitch-Watcher não rode, caso queria mudar, passe como false ou retire ela de twitch.json',
      json,
    )
    return setTimeout(() => process.exit(0), 1000 * 2) as any
  }

  notify('Abrindo Twitch Watcher', 'Verificando se streamers estão online', json)

  const id = faker.random.alphaNumeric(4)

  const dispose = listenToApi(id, json)

  return dispose
}
