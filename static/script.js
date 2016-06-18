window.onload = function() {
    var request = new XMLHttpRequest();
    request.open('GET', '/getRepos', true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            displayContent(JSON.parse(this.response));
        }
    };
    request.send();
};

function displayContent(repos) {
    repos.forEach(function(dir) {
        var tr = document.createElement('tr');
        var td = [
            document.createElement('td'),
            document.createElement('td')
        ]
        td[0].innerText = dir;
        td[1].innerText = 'git@git.oskarnyberg.com:' + dir;
        td.forEach(function(t) {
            tr.appendChild(t);
        });
        document.querySelector('table').appendChild(tr);
    });
}

function newRepo() {
    var name = prompt('name:');
    var request = new XMLHttpRequest();
    request.open('GET', '/newRepo?name=' + name, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            location.reload(true);
        }
    };
    request.send();
}

