const net = require('net')
const path = require('path')
const server = net.createServer((socket) => socket.end('running\n'))

module.exports = () => {
  setTimeout(() => {
    server.listen(path.resolve('./test-socket'))
  }, 500)
  return server
}
