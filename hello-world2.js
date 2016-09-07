require('fs').writeFileSync('./hello2.txt', 'hello, world', 'utf8')
process.send('yo')
