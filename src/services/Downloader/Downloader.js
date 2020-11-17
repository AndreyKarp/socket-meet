const fs = require('fs')
const path = require('path')

module.exports = class Downloader {

  pathToLink (message) {
    const filename = `${this.getRandomNumber()}_${this.getReplaceFileName(message.data.filename)}`
    const uploadsPath = path.join('/tmp', filename)
    fs.writeFile(uploadsPath, message.data.file, (err) => err)
    return uploadsPath
  }

  getRandomNumber () {
    return parseInt(Math.random() * 100)
  }

  getReplaceFileName (filename) {
    return filename.replace(
      /[^а-яА-Яa-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸЇїіІçÇßØøÅåÆæœ0-9\.]+/g,
      '-')
  }
}