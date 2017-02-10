#!/usr/bin/env node

const ghitto = require('../server.js')

const port = parseInt(process.argv[2])
let path = process.argv[3]
const ssh = process.argv[4]
const readOnly = Boolean(JSON.parse(process.argv[5] || false))

if (path.slice(-1) !== '/') {
    path += '/'
}

ghitto(port, path, ssh, readOnly)

