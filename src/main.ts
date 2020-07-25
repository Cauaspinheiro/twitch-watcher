import faker from 'faker'
import { Config } from './types'
import listenToApi from './listenApi'

export default function fn(json: Config) : () => Promise<void> {
  if (json.deactivate) {
    console.log('Option [deactivate] was passed to true, deactivating...')
    process.exit(0)
  }

  const id = faker.random.alphaNumeric(4)

  const dispose = listenToApi(id, json)

  return dispose
}
