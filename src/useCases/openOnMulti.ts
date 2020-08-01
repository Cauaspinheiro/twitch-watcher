import open from 'open'

export default async function openOnMulti(newStreamers: string[],
  openStreamers?: string[]) : Promise<void> {
  if (openStreamers && openStreamers.length >= 1) {
    const streamers = [...newStreamers, ...openStreamers]

    let url = 'https://www.multitwitch.tv'

    streamers.forEach((streamer) => {
      url = `${url}/${streamer}`
    })

    await open(url)
  }
}
