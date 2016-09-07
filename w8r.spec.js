const path = require('path')
const fs = require('fs')
const test = require('tap').test

const w8r = require('./')
const testServer = require('./test-server')
const testServer2 = require('./test-server2')

test('it waits', (t) => {
  const s = testServer()
  w8r(50, 'localhost:9999', require.resolve('./hello-world.js'), (err, child) => {
    child.on('message', () => {
      t.error(err, 'no errors')
      t.equal(fs.readFileSync('./hello.txt', 'utf8'), 'hello, world', 'Hello!')
      s.close()
      child.disconnect()
      child.kill()
      fs.unlinkSync('./hello.txt')
      t.end()
    })
  })
})

test('multiple times', (t) => {
  const s = testServer()
  const s2 = testServer2()
  const servers = [
    {host: 'localhost', port: 9999},
    path.resolve('./test-socket')
  ]
  w8r(50, servers, require.resolve('./hello-world2.js'), (err, child) => {
    t.error(err, 'no errors')
    child.on('message', () => {
      t.equal(fs.readFileSync('./hello2.txt', 'utf8'), 'hello, world', 'Hello!')
      s.close()
      s2.close()
      child.disconnect()
      child.kill()
      fs.unlinkSync('./hello2.txt')
      t.end()
    })
  })
})
