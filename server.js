const fs = require('fs'),
      app = require('express')(),
      serveStatic = require('serve-static'),
      execSync = require('child_process').execSync

const path = '/var/git/'
const ssh = 'git@git.oskarnyberg.com:'

app.use("/", serveStatic(__dirname + "/static/"))

app.get('/getRepos', (req, res) => {
    res.send(JSON.stringify(getContent()))
})

app.get('/newRepo', (req, res) => {
    res.send(JSON.stringify(newRepo(req.query.name)))
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
                    content.push(formatResponse(file))
                } catch (e) {
                }
            }
        } catch (e) {
        }
    })

    return content
}

function formatResponse(dirName) {
    let name
    if (dirName.indexOf('.git') !== -1) {
        name = dirName.substr(0, dirName.lastIndexOf('.git'))
    } else {
        name = dirName
    }
    let repo = ssh + name + '.git'
    let clone = 'git clone ' + repo
    return {name, repo, clone}
}

function newRepo(name) {
    let repo = '/var/git/' + name + '.git'
    try {
        let a = fs.lstatSync(repo)
        return {error: 'Repo already exists.'}
    } catch(e) {
        execSync('mkdir ' + repo)
        execSync('cd ' + repo + ' && git --bare init')
        execSync('chmod 700 -R ' + repo)

        return formatResponse(name)
    }
}

app.listen(8084, () => {
      console.log('Listening...')
})

