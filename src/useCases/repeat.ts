import useConfig from '../hooks/useConfig'

import main from '../main'

export default function repeat() : () => Promise<void> {
  const config = useConfig()

  main(true)

  const interval = setInterval(() => main(), config.twitch_api.repeatEachMs || config.shutDown
    ? 1000 * 60 * 10 : 1000 * 60 * 2)

  return async function dispose() {
    clearInterval(interval)
  }
}
