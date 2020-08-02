const notifyMessages = {
  deactivate: {
    title: 'Desativando...',
    message: 'Usar a opção [deactivate] faz com que o serviço da Twitch-Watcher não rode, caso queria mudar, passe como false ou retire ela de twitch.json',
  },
  shutDownOpts: {
    title: 'Esperando para desligar...',
    message: 'Usar a opção "shutDown" faz com que o seu PC desligue depois que nenhum streamer está mais em live.',
  },
  configStreamers: {
    title: 'Sem streamers para verificar!',
  },
  newStreamer: {
    title: 'Alguém abriu a live!!!',
  },
  newStreamers: {
    title: 'Alguns streamers abriram a live!!!',
  },
  closedStreamer: {
    title: 'Alguém fechou a live...',
  },
  closedStreamers: {
    title: 'Alguns streamers fecharam a live',
  },
  shutDownFn: {
    title: 'Sem streamers para verificar!',
    message: 'Você ativou a opção para desligar quando acabarem as lives mas nenhuma live está on.',
  },
}

export default notifyMessages
