const { asClass } = require('awilix')
const CommunicationCore = require('./CommunicationCore')

module.exports = class CommunicationCoreServiceProvider {
  boot () {
    return {
      CommunicationCore: asClass(CommunicationCore, {
        injector: () => {
          const Axios = require('../Axios')
          return {
            http: new Axios(
              {
                baseURL: process.env.CCC,
                responseType: 'json',
                headers: {
                  'content-type': 'application/json; charset=utf-8',
                },
              },
            ),
          }
        },
      }).singleton(),
    }
  }
}
