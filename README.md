# w8r
[![Build Status](https://travis-ci.org/scriptoLLC/w8r.svg?branch=master)](https://travis-ci.org/scriptoLLC/w8r)
Poll to see if a service is running, and once it is, fork a new node process

## Huh?
`(net|http).createServer()#listen` is async. Sometimes you want to do something
but only after the a server has started. You can just hope it starts in time,
or you can use this.

Also useful for docker-compose -- if you have dependent containers, docker will
wait for the container to be ready, but it doesn't know if the service is
ready yet.  This makes sure your app won't start until the service it depends
on is available.

## Usage

`npm install --save w8r`

```
const w8r = require('w8r')
const serverlist = [{host: 'redis', port: 6379}, '/var/run/mysql']
w8r(50, serverlist, 'start-server.js', (err, child) => {
  // both services are up and running!
  // and child is your child process you started!
})
```

## API

* `w8r(checkInterval:number, serverList:array, procfile:string, procargs?:array(string), procopts?:object, cb:function)`
Spawn a `net` client to check to see if the server at the provided host:port is
available every `checkInterval` ms and then fork a new node process.

* `checkInterval:number` - amount of delay, in ms, before trying again
* `profile:string` - the path to the entry point for the child process
* `procargs:array(string)` (optional) - arguments to your command
* `procopts:object` (optional) - options for the [`child_process.fork`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) command

The `serverList` array can contain two separate object types:
* paths to unix domain sockets (e.g.: `/var/run/mysql`)
* objects containing a `port` and `host` key (e.g.: `{port: 6379, host: 'redis'}`)

## Licence
Copyright © 2016 Scripto, LLC. Apache-2.0 Licensed.
