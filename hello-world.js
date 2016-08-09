require('fs').writeFileSync('./hello.txt', 'hello, world', 'utf8')
process.send('yo')
