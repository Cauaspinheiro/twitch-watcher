import Powershell from 'node-powershell'
import fs from 'fs'
import useConfig from '../hooks/useConfig'
import cache from '../services/nodeCache'

export default async function shutdown() : Promise<void> {
  const config = useConfig()
  const ps = new Powershell({})

  delete config.shutDown

  const configPath = cache.get<string>('configPath')

  if (configPath) {
    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 1))
  }

  await ps.addCommand('shutdown /s')
  await ps.invoke()
}
