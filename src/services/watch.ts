import watch from 'node-watch'
import path from 'path'
import fs from 'fs'
import { Config } from '../types'

type Fn = (json: Config) => void

export default function listen(fn: Fn) : void {
  const configPath = path.resolve(__dirname, '..', '..', 'config.json')

  function readAndRun() {
    fs.readFile(configPath, (err, data) => {
      if (err) throw err

      fn(JSON.parse(data as any))
    })
  }
  readAndRun()

  watch(configPath, async (evt, name) => {
    if (evt === 'remove') return

    readAndRun()
  })
}
