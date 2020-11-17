const { createContainer, asValue } = require('awilix')
const ServiceKernel = require('./ServiceKernel')
const config = require('../config')

module.exports = class Kernel {
  boot () {
    if (this.container) {
      return
    }
    this.container = this.createContainer()
    this.registerServiceProviders()
  }

  getContainer () {
    this.boot()
    return this.container
  }

  createContainer () {
    const container = createContainer()
    container.loadModules(
      [
        'src/services/**/*.js',
        'src/listeners/**/*.js',
      ])
    container.register({
      config: asValue(config),
    })

    return container
  }

  registerServiceProviders () {
    const serviceKernel = new ServiceKernel(this.container)
    serviceKernel.boot()
  }

}
