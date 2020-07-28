/* eslint-disable no-template-curly-in-string */
import open from 'open'
import { Config, StreamerReq } from './types'
import api from './services/axios'
import isArraysEqual from './utils/isArraysEqual'
import notify from './notifier'

export default function listenToApi(id: string, config: Config) : () => Promise<void> {
  let openStreamers : string[] = []

  async function openArray(streamers : string[]) {
    const newStreamers = streamers.filter((streamer) => {
      if (!openStreamers.includes(streamer)) return streamer
    })

    streamers.forEach(async (streamer) => {
      if (!openStreamers.includes(streamer)) {
        if (config.url) {
          await open(config.url.replace('${streamer}', streamer))
          return openStreamers.push(streamer)
        }

        switch (config.level) {
          case 0:
            await open(`https://www.twitch.tv/popout/${streamer}/chat?popout=true`)
            break
          case 1:
            await open(`https://player.twitch.tv/?channel=${streamer}&enableExtensions=true&muted=true&parent=twitch.tv&player=popout`)
            break

          default:
            await open(`https://www.twitch.tv/${streamer}`)
            break
        }

        return openStreamers.push(streamer)
      }
    })

    if (newStreamers.length > 0) {
      if (newStreamers.length === 1) {
        notify('Novo streamer on!!!', `${newStreamers.toString()} está online`, config)
      } else {
        notify('Novos streamers on!!!', `Novos streamers: ${newStreamers.join(', ')}`, config)
      }
    }
  }

  async function openOnMulti(streamers : string[]) {
    if (!isArraysEqual(streamers, openStreamers)) {
      const newStreamers = streamers.map((streamer) => {
        if (!openStreamers.includes(streamer)) return streamer

        return undefined
      })

      if (newStreamers.length > 0 && !config.updated) {
        if (newStreamers.length === 1) {
          notify('Novo streamer on!!!', `${newStreamers.toString()} está online`, config)
        } else {
          notify('Novos streamers on!!!', `Novos streamers: ${newStreamers.join(', ')}`, config)
        }
      }

      let url = 'https://www.multitwitch.tv'

      streamers.forEach((streamer) => {
        url = `${url}/${streamer}`
      })

      await open(url)
      openStreamers = streamers
    }
  }

  async function request() {
    const streamers : string[] = []

    config.streamers.forEach((streamer) => {
      if (streamer.level <= config.level) streamers.push(streamer.username)
    })

    if (!streamers) {
      notify('Sem streamers para verificar!',
        `Você não passou nenhum streamer no nível ${config.level}, atualize seu arquivo de configuração. Parando serviço...`,
        config)
      process.exit(0)
    }

    const query = `user_login=${streamers.join('&user_login=')}`

    try {
      const { data: res } = await api.get<StreamerReq>(`/streams?${query}`, {
        headers: {
          authorization: `Bearer ${config.jwt}`,
          'client-id': config.twitch_id,
        },
      })

      if (res.data.length > 0) {
        const ids = res.data.map((streamer) => streamer.user_name)

        const closedStreamers : string[] = []

        openStreamers = openStreamers.filter((streamer) => {
          if (ids.includes(streamer)) return streamer

          closedStreamers.push(streamer)
        })

        if (closedStreamers.length > 0 && !config.updated) {
          if (closedStreamers.length === 1) {
            notify('Alguém fechou a live...', `${closedStreamers.toString()} fechou a live`, config)
          } else {
            notify('Alguns streamers fecharam a live',
              `Streamers que ficaram off: ${closedStreamers.join(', ')}`, config)
          }
        }

        switch (config.level) {
          case 0:
            openArray(streamers)
            break
          case 1:
            openArray(streamers)
            break
          case 2:
            if (config.url) { openArray(streamers) } else {
              openOnMulti(streamers)
            }
            break
          case 3:
            openArray(streamers)
            break
          default:
            break
        }
      } else {
        openStreamers = []
      }
    } catch (error) {
      console.log(error)
    }
  }

  request()

  const interval = setInterval(() => request(), config.repeatEachMs || 1000 * 60 * 3)

  async function dispose() {
    clearInterval(interval)
  }

  return dispose
}
