import Powershell from 'node-powershell'
import fs from 'fs'
import useConfig from '../hooks/useConfig'
import cache from '../services/nodeCache'
import logger from '../services/logger'

export default async function shutdown() : Promise<void> {
  const config = useConfig()
  const ps = new Powershell({})

  delete config.shutDown

  const configPath = cache.get<string>('configPath')

  if (configPath) {
    logger.info('[/useCases/shutdown]: rewriting config file without config.shutDown')

    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 2))
  }

  logger.info('[/useCases/shutdown]: shutting down pc')

  await ps.addCommand('shutdown /s')
  await ps.invoke()
}
