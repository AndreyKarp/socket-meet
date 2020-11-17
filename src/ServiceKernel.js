const CommunicationCoreServiceProvider = require('./services/CommunicationCore/CommunicationCoreServiceProvider')

module.exports = class ServiceKernel {
  constructor (container) {
    this.container = container
  }

  serviceProviders () {
    return [
      new CommunicationCoreServiceProvider(),
    ]
  }

  boot () {
    this.serviceProviders().forEach(serviceProvider => {
      for (const serviceName in serviceProvider.boot()) {
        this.container.register(
          serviceName,
          serviceProvider.boot()[serviceName],
        )
      }
    })
  }
}
