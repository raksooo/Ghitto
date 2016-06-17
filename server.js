#!/usr/bin/env node

const http = require('http')
const fs = require('fs')

const hostname = 'localhost'
const port = '8084'

const path = '/var/git/'

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    let content = '<table style="width:600px;">'
    content += generateHTML(getContent())
    content += '</table>'
    res.end(content)
})

function getContent() {
    let content = []
    let dir = fs.readdirSync(path)
    dir.forEach(file => {
        try {
            let stat = fs.statSync(path + file)
            if (stat.isDirectory()) {
                try {
                    fs.statSync(path + file + '/HEAD')
                    content.push(file)
                } catch (e) {
                }
            }
        } catch (e) {
        }
    })

    return content
}

function generateHTML(dirs) {
    let html = ''
    dirs.forEach(dir => {
        html += '<tr><td>'
        html += dir
        html += '</td><td>'
        html += 'git@git.oskar.ninja:'
        html += dir
        html += '</td></tr>'
    })

    return html
}

server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`)
})

