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
w8r(50, 'redis', 6379, 'populate-redis.js', (err, child) => {
  // redis is running and your child process has been forked!
})
```

## API

* `w8r(checkInterval:number, host:string, port:number, procfile:string, procargs?:array(string), procopts?:object, cb:function)`
Spawn a `net` client to check to see if the server at the provided host:port is
available every `checkInterval` ms and then fork a new node process.

* `checkInterval:number` - amount of delay, in ms, before trying again
* `host:string` - the hostname where your server is
* `port:number` - the port number
* `profile:string` - the path to the entry point for the child process
* `procargs:array(string)` (optional) - arguments to your command
* `procopts:object` (optional) - options for the [`child_process.fork`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) command

## Licence
Copyright © 2016 Scripto, LLC. Apache-2.0 Licensed.
