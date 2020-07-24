import open from 'open'
import Shell from 'node-powershell'

const promise = open('https://www.twitch.tv/tixinhadois')

const ps = new Shell({})

const promise2 = ps.addCommand('taskkill /IM chrome.exe /F')

const promise3 = ps.invoke().catch(() => null)

Promise.all([promise, promise2, promise3]).then(() => process.exit(0))
