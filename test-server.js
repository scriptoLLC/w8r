const net = require('net')
const server = net.createServer((socket) => socket.end('running\n'))

module.exports = () => {
  setTimeout(() => {
    server.listen(9999, 'localhost')
  }, 500)
  return server
}
