const net = require('net')
const fork = require('child_process').fork
const ignore = ['ENOENT', 'ECONNREFUSED']

module.exports = function (interval, servers, procfile, procargs, procopts, cb) {
  const timers = []

  if (typeof procopts === 'function') {
    cb = procopts
    procopts = {}
  }

  if (typeof procargs === 'function') {
    cb = procargs
    procargs = []
    procopts = []
  }

  if (!Array.isArray(servers)) {
    const [host, port] = servers.split(':')
    if (!port) {
      servers = [servers]
    } else {
      servers = [{host, port}]
    }
  }

  const _total = servers.length
  let _done = 0

  servers.forEach(s => check(interval, timers, s, procfile, procargs, procopts, done))

  function done (err) {
    ++_done
    if (err) {
      timers.forEach(tid => clearInterval(tid))
      _done = _total
      return cb(err)
    }

    if (_done === _total) {
      const child = fork(procfile, procargs, procopts)
      cb(null, child)
    }
  }
}

function check (interval, timers, server, procfile, procargs, procopts, cb) {
  timers.push(setInterval(checkServer, interval))

  function checkServer () {
    const client = net
      .connect(server, () => {
        client.end()
        clearInterval(timers.pop())
        return cb()
      })
      .on('error', (err) => {
        if (!ignore.includes(err.code)) {
          client.end()
          return cb(err)
        }
      })
  }
}
