const fs = require('fs')
const test = require('tap').test

const w8r = require('./')
const testServer = require('./test-server')
const testServer2 = require('./test-server2')

test('it waits', (t) => {
  const s = testServer()
  w8r(50, 'localhost:9999', require.resolve('./hello-world.js'), (err, res) => {
    const child = res['localhost:9999']
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
  t.plan(3)
  const s = testServer()
  const s2 = testServer2()
  w8r(50, [{host: 'localhost', port: 9999}, {host: 'localhost', port: 9998}], require.resolve('./hello-world2.js'), (err, res) => {
    t.error(err, 'no errors')
    const child1 = res['localhost:9999']
    const child2 = res['localhost:9998']
    child1.on('message', () => {
      t.equal(fs.readFileSync('./hello2.txt', 'utf8'), 'hello, world', 'Hello!')
      s.close()
      child1.disconnect()
      child1.kill()
      fs.unlinkSync('./hello2.txt')
    })

    child2.on('message', () => {
      t.ok(true, 'message recieved')
      s2.close()
      child2.disconnect()
      child2.kill()
    })
  })
})

test('bad servers', (t) => {
  w8r(50, 'localhost', require.resolve('./hello-world.js'), (err) => {
    t.ok(err)
    t.equal(err.message, 'localhost is not a valid [host]:[port] combination')
    t.end()
  })
})
