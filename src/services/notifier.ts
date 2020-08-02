import notifier from 'node-notifier'
import path from 'path'
import useConfig from '../hooks/useConfig'
import logger from './logger'

const windowsNotifier = new notifier.WindowsToaster()

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function notify(title: string, message: string) : Promise<unknown> {
  logger.info('[/services/notifier]: getting config from useConfig')

  const config = useConfig()

  const options = {
    appID: 'Twitch Watcher',
    icon: path.resolve(__dirname, '..', '..', 'twitch.png'),
    sound: false,
    wait: false,
    title,
    message,
  }

  if (config.notify === true) {
    windowsNotifier.notify(options)

    logger.info('[/services/notifier]: notifying because config.true == true')

    return timeout(1000)
  }

  if (config.notify === undefined && process.env.NODE_ENV !== 'dev') {
    windowsNotifier.notify(options)

    logger.info('[/services/notifier]: notifying because config.notify == undefined and process.env.NODE_ENV != dev')

    return timeout(1000)
  }

  return timeout(0)
}
