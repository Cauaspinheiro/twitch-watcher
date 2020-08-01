import open from 'open'

export default async function openArray(streamers: string[], url: string) {
  const promises = streamers.map((streamer) => open(url.replace('${streamer}', streamer)))

  return Promise.all(promises)
}
