const net = require('net')
const fork = require('child_process').fork

module.exports = function (interval, host, port, procfile, procargs, procopts, cb) {
  if (typeof procopts === 'function') {
    cb = procopts
    procopts = {}
  }

  if (typeof procargs === 'function') {
    cb = procargs
    procargs = []
    procopts = []
  }

  const checkTimer = setInterval(checkServer, interval)

  function checkServer () {
    const client = net
      .connect({port: port, host: host}, () => {
        client.end()
        clearInterval(checkTimer)
        const child = fork(procfile, procargs, procopts)
        cb(null, child)
      })
      .on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
          client.end()
          return cb(err)
        }
      })
  }
}
