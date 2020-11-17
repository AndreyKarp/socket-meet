process.env.APP_ROOT = __dirname
const app = require('express')()
const config = require('./config')
require('dotenv').config()
const cors = require('cors')
const { asValue } = require('awilix')
const Kernel = require('./src/Kernel')
const kernel = new Kernel()
kernel.boot()

kernel.getContainer().register({
  container: asValue(kernel.getContainer()),
})

app.use(cors(function (req, callback) {
  let corsOptions
  let whitelist = config.whitelist || []
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}))

const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', function (socket) {
  kernel.getContainer().resolve('Logger').info(`connect new socketUser ${socket.id}`)
  kernel.getContainer().resolve('ChatSocketListener').listen(io, socket)
})

http.listen(process.env.PORT, () => {
  kernel.getContainer().
    resolve('Logger').
    info(`Listener on full_host ${process.env.PORT}`)
})
