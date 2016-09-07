const net = require('net')
const fork = require('child_process').fork

module.exports = function (interval, servers, procfile, procargs, procopts, cb) {
  const timers = {}
  const status = {}

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
    if (!host || !port) {
      return cb(new Error(`${servers} is not a valid [host]:[port] combination`))
    }
    servers = [{host, port}]
  }

  const _total = servers.length
  let _done = 0

  servers.forEach(s => check(interval, timers, s.host, s.port, procfile, procargs, procopts, done))

  function done (err, key, child) {
    ++_done
    if (err) {
      Object.keys(status).forEach(tid => clearInterval(tid))
      _done = _total
      return cb(err)
    }

    status[key] = child

    if (_done === _total) {
      cb(null, status)
    }
  }
}

function check (interval, timers, host, port, procfile, procargs, procopts, cb) {
  const key = `${host}:${port}`
  timers[key] = setInterval(checkServer, interval)

  function checkServer () {
    const client = net
      .connect({port: port, host: host}, () => {
        client.end()
        clearInterval(timers[key])
        const child = fork(procfile, procargs, procopts)
        cb(null, key, child)
      })
      .on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
          client.end()
          return cb(err)
        }
      })
  }
}
