import Powershell from 'node-powershell'

export default async function shutdown() : Promise<void> {
  const ps = new Powershell({})

  await ps.addCommand('shutdown /s')
  await ps.invoke()
}
