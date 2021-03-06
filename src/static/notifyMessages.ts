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
    title: 'Parando de verificar alguém...',
  },
  closedStreamers: {
    title: 'Parando de verificar...',
  },
  shutDownFn: {
    title: 'Sem streamers para verificar!',
    message: 'Você ativou a opção para desligar quando acabarem as lives mas nenhuma live está on.',
  },
  restart: {
    title: 'Reiniciando Twitch Watcher...',
    message: 'Você ativou a opção para restart o Twitch Watcher no arquivo de configurações',
  },
  points: {
    title: 'Atualização dos pontos',
  },
}

export default notifyMessages
