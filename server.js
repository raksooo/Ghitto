const fs = require('fs'),
      app = require('express')(),
      serveStatic = require('serve-static'),
      execSync = require('child_process').execSync

const path = '/var/git/'
const ssh = 'git@git.oskarnyberg.com:'

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
        relative = '';
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
        } catch (e) {
        }
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
    let repo = ssh + path + name + '.git'
    let clone = 'git clone ' + repo
    return {name, repo, clone}
}

function newRepo(path, name) {
    let repo = '/var/git/' + path + name + '.git'
    try {
        let a = fs.lstatSync(repo)
        return {error: 'Repo already exists.'}
    } catch(e) {
        execSync('mkdir ' + repo)
        execSync('cd ' + repo + ' && git --bare init')
        execSync('chmod 700 -R ' + repo)

        return formatResponse(path, name)
    }
}

app.listen(8084, () => {
      console.log('Listening...')
})

