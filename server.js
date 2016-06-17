const fs = require('fs'),
      app = require('express')(),
      serveStatic = require('serve-static'),
      exec = require('child_process').exec

const path = '/var/git/'

app.use("/", serveStatic(__dirname + "/static/"))

app.get('/getRepos', (req, res) => {
    res.send(JSON.stringify(getContent()))
})

app.get('/newRepo', (req, res) => {
    res.send(JSON.stringify(newRepo(req.query.name)))
})

function getContent() {
/*    let content = []
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

    return content*/
    return ["asdf", "qwerty"]
}

function newRepo(name) {
    let repo = '/var/git/' + name + '.git'
    exec('mkdir ' + repo)
    exec('cd ' + repo + ' && git --bare init')
}

app.listen(8084, () => {
      console.log('Listening...')
})

