import watch from 'node-watch'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { Config } from '../types'

type Fn = (json: Config) => () => Promise<void>

export default function listen(fn: Fn) : void {
  let configPath : string

  if (process.env.NODE_ENV === 'dev') {
    configPath = path.resolve(__dirname, '..', '..', 'config.json')
  } else {
    configPath = path.resolve('/', 'users', os.userInfo().username,
      'desktop', 'twitch.json')
  }

  let dispose : () => Promise<void>

  function readAndRun() {
    fs.readFile(configPath, (err, data) => {
      if (err) throw err

      dispose = fn(JSON.parse(data as any))
    })
  }
  readAndRun()

  watch(configPath, async (evt, name) => {
    if (evt === 'remove') return

    await dispose()

    readAndRun()
  })
}
