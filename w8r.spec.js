const fs = require('fs')
const test = require('tap').test

const w8r = require('./')
const testServer = require('./test-server')

test('it waits', (t) => {
  const s = testServer()
  w8r(50, 'localhost', 9999, require.resolve('./hello-world.js'), (err, child) => {
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
