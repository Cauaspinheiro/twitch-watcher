import notifier from 'node-notifier'
import path from 'path'
import { Config } from './types'

const windowsNotifier = new notifier.WindowsToaster()

export default function notify(title: string, message: string, config: Config) : void {
  const options = {
    appID: 'Twitch Watcher',
    icon: path.resolve(__dirname, '..', 'twitch.png'),
    sound: false,
    wait: false,
    title,
    message,
  }

  if (config.notify === true) {
    windowsNotifier.notify(options)
  } else if (config.notify === false) {
    windowsNotifier.notify(options)
  } else if (process.env.NODE_ENV !== 'dev') {
    windowsNotifier.notify(options)
  }
}
