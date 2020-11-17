const axios = require('axios')

module.exports = class Axios {
  constructor (_headers) {
    this.config = {}
    this.service = axios.create(_headers)
    this.addConfig('default', _headers)
  }

  makeRequest (method, url, queryParams = null, body = null, configName = 'default') {
    this.setConfigHeader(configName)
    let request
    switch (method) {
      case 'GET':
        request = this.service.get(url, queryParams)
        break
      case 'POST':
        request = this.service.post(url, body, queryParams)
        break
      case 'PUT':
        request = this.service.put(url, body, queryParams)
        break
      case 'PATCH':
        request = this.service.patch(url, body, queryParams)
        break
      case 'DELETE':
        request = this.service.delete(url, queryParams)
        break
      default:
        throw new Error('Method not supported')
    }

    return new Promise((resolve, reject) => {
      request
        .then(response => {
            if (response.data === 'OK') {
              resolve(response.data)
              return
            }
            if (response.data['status'] in response.data) {
              if (response.data['status'] === 'error') {
                console.error(new Error(response.data['error'], response.data['message']))
              } else {
                resolve(response.data)
              }
            } else {
              resolve(response.data)
            }
          }
        )
        .catch(err => {
          if (err.response) {
            if (err.response.data) {
              if (err.response.status) {
                console.log({ code: err.response.status, error: JSON.stringify(err.response.data) })
                reject({ code: err.response.status, error: JSON.stringify(err.response.data) })
              } else {
                console.error(err)
                reject(err)
              }
            } else {
              console.error(err)
              reject(err)
            }
          } else {
            console.error(err)
            reject(err)
          }
        })
    })
  }

  get (url, queryParams = null, configName = 'default') {
    return this.makeRequest('GET', url, { params: queryParams }, null, configName)
  }

  post (url, body, queryParams = null, configName = 'default') {
    return this.makeRequest('POST', url, { params: queryParams }, body, configName)
  }

  put (url, body, queryParams = null, configName = 'default') {
    return this.makeRequest('PUT', url, { params: queryParams }, body, configName)
  }

  patch (url, body, queryParams = null, configName = 'default') {
    return this.makeRequest('PATCH', url, { params: queryParams }, body, configName)
  }

  delete (url, queryParams = null, configName = 'default') {
    return this.makeRequest('DELETE', url, queryParams, null, configName)
  }

  setConfigHeader (configName = null) {
    if (configName === null) {
      throw Error('Config name is required')
    }
    if (configName in this.config) {
      let instanceHeaders = this.service.defaults.headers
      const configHeader = this.config[configName].headers

      instanceHeaders = Object.assign(instanceHeaders, configHeader)
    } else {
      throw Error(`Config ${ configName } not found`)
    }
  }

  addConfig (name, config) {
    if (name === null || config === null) {
      throw Error(`Config name and config's params is required`)
    }
    if (name in config) {
      throw Error(`Configuration ${ name } already defined`)
    }
    this.config[name] = config
  }
}
