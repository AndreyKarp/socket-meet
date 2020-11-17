module.exports = class CommunicationCore {
  constructor ({ http, config, Logger }) {
    this.http = http
    this.config = config
    this.logger = Logger
  }

  async sendMessage (params) {
    this.logger.info({ params })
    const response = await this.http.post(
      `${(this.config.ccc.path.webChat(this.config.ccc.token))}`,
      params,
      this.config.ccc.token,
    )
    this.logger.info({ response })
    return response.body || response
  }
}