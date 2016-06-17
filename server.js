#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const express = require('express')()

const path = '/var/git/'

app.get('/', (req, res) => {
    let content = '<table style="width:600px;">'
    content += generateHTML(getContent())
    content += '</table>'
    res.send(content)
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

app.listen(8084, () => {
      console.log(`Server running at http://${hostname}:${port}/`)
})

