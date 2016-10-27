#!/usr/bin/env node

const fs = require('fs'),
      app = require('express')(),
      serveStatic = require('serve-static'),
      execSync = require('child_process').execSync

const port = parseInt(process.argv[2])
let path = process.argv[3]
const ssh = process.argv[4]

if (path.slice(-1) !== '/') {
    path += '/'
}

app.use("/", serveStatic(__dirname + "/static/"))

app.get('/getRepos', (req, res) => {
    let relative = req.query.path || ''
    res.send(JSON.stringify(getContent(relative)))
})

app.get('/newRepo', (req, res) => {
    let path = req.query.path
    let name = req.query.name
    let repo = newRepo(path, name)
    res.send(JSON.stringify(repo))
})

function getContent(relative) {
    if (relative.indexOf('..') !== -1) {
        relative = ''
    }

    let currentPath = path + relative
    let gitDirs = []
    let otherDirs = []

    let dir = fs.readdirSync(currentPath)
    dir.forEach(file => {
        try {
            let stat = fs.statSync(currentPath + file)
            if (stat.isDirectory()) {
                try {
                    fs.statSync(currentPath + file + '/HEAD')
                    gitDirs.push(formatResponse(relative, file))
                } catch (e) {
                    if (file.charAt(0) !== '.') {
                        otherDirs.push(file)
                    }
                }
            }
        } catch (e) { }
    })

    return {git: gitDirs, other: otherDirs}
}

function formatResponse(path, dirName) {
    let name
    if (dirName.indexOf('.git') !== -1) {
        name = dirName.substr(0, dirName.lastIndexOf('.git'))
    } else {
        name = dirName
    }
    let repo = ssh + ':' + path + name + '.git'
    let clone = 'git clone ' + repo
    return {name, repo, clone}
}

function newRepo(relative, name) {
    let repo = path + relative + name + '.git'
    try {
        let a = fs.lstatSync(repo)
        return {error: 'Repo already exists.'}
    } catch(e) {
        execSync('mkdir ' + repo)
        execSync('cd ' + repo + ' && git --bare init')
        execSync('chmod 700 -R ' + repo)

        return formatResponse(relative, name)
    }
}

app.listen(port, () => {
    console.log('Listening...')
})

