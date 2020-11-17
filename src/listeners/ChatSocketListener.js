module.exports = class ChatSocketListener {
  static CONNECTED_USERS = {}
  static SOCKET_IDS = []

  constructor ({ CommunicationCore, Logger, Downloader, config }) {
    this.communicationCore = CommunicationCore
    this.logger = Logger
    this.downloader = Downloader
    this.config = config
  }

  async listen (io, socket) {

    socket.on('chat.client.message', async message => {
      this.logger.info(message)
      const params = { ...message }
      params.socketId = socket.id
      if (message.type === 'file') {
        const uploadsPath = this.downloader.pathToLink(message)
        params.data.file = []
        params.data.file.push(uploadsPath)
      }
      await this.communicationCore.sendMessage(params)
    })

    socket.on('chat.client.returning_visitor', async message => {
      ChatSocketListener.SOCKET_IDS.push(socket.id)
      ChatSocketListener.CONNECTED_USERS[message] = ChatSocketListener.SOCKET_IDS
    })

    socket.on('communication-core-event', async (message, hash) => {
      if (hash === this.config.ccc.token) {
        ChatSocketListener.CONNECTED_USERS[message.chatId].forEach(socket => {
          io.to(socket).emit('chat.broker.message', message.message)
        })

      }
    })

    socket.on('disconnect', () => {
      Object.keys(ChatSocketListener.CONNECTED_USERS).forEach(chatId => {
        ChatSocketListener.CONNECTED_USERS[chatId] = ChatSocketListener.CONNECTED_USERS[chatId].filter(
          item => item !== socket.id)
      })
    })

  }
}