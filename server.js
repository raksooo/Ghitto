const fs = require('fs'),
      app = require('express')(),
      serveStatic = require('serve-static'),
      execSync = require('child_process').execSync

const path = '/var/git/'

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
                    content.push(file)
                } catch (e) {
                }
            }
        } catch (e) {
        }
    })

    return content
}

function newRepo(name) {
    let repo = '/var/git/' + name + '.git'
    execSync('mkdir ' + repo)
    execSync('cd ' + repo + ' && git --bare init')
    execSync('chmod 700 -R ' + repo)
}

app.listen(8084, () => {
      console.log('Listening...')
})

