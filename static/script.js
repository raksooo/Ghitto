window.onload = function() {
    fillTable();
};

var replacedTd;
var replacedText;

var currentDir = '';

function fillTable(relative) {
    if (typeof relative === 'undefined') {
        relative = currentDir;
    }
    currentDir = relative;

    clear();
    retrieveContnent(function(content) {
        displayContent(content.git);
        displayDirs(content.other, relative.length > 0);
    });
}

function clear() {
    document.querySelector('nav#directories').innerHTML = '';
    document.querySelectorAll('table tr:not(:first-child)').forEach(element => {
        element.parentNode.removeChild(element);
    })
}

function retrieveContnent(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/getRepos?path=' + encodeURIComponent(currentDir)
            , true);

    request.onload = function() {
        if (this.status === 200) {
            callback && callback(JSON.parse(this.response));
        }
    };
    request.send();
}

function displayDirs(dirs, notRoot) {
    if (notRoot) {
        var a = document.createElement('span');
        a.textContent = '..';
        a.setAttribute('onclick', ';');
        var _current = currentDir.slice(0, -1);
        _current = _current.substr(0, _current.lastIndexOf('/') + 1);
        a.onclick = fillTable.bind(this, _current);
        document.querySelector('nav#directories').appendChild(a);
    }

    dirs.forEach(function(dir) {
        var a = document.createElement('span');
        a.textContent = dir;
        a.setAttribute('onclick', ';');
        a.onclick = fillTable.bind(this, currentDir + dir + '/');
        document.querySelector('nav#directories').appendChild(a);
    });
}

function displayContent(repos) {
    repos.forEach(function(repo) {
        var tr = document.createElement('tr');
        var td = [
            document.createElement('td'),
            document.createElement('td')
        ]
        let span = document.createElement('span');
        span.innerText = repo.name;
        span.setAttribute('onclick', ';');
        span.onclick = replaceWithClone;
        td[0].appendChild(span);
        td[1].innerText = repo.repo;
        td.forEach(function(t) {
            tr.appendChild(t);
        });

        document.querySelector('table').appendChild(tr);
    });
}

function newRepo() {
    var name = prompt('name:');
    if (name !== null) {
        var request = new XMLHttpRequest();
        request.open('GET', '/newRepo?path=' + encodeURIComponent(currentDir)
                + '&name=' + name, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                var response = JSON.parse(this.response);
                if (!response.error) {
                    fillTable();
                    fillGuide(response);
                } else {
                    alert(response.error);
                }
            }
        };
        request.send();
    }
}

function fillGuide(repo) {
    var nameContainers = document.querySelectorAll('.repoName');
    var urlContainers = document.querySelectorAll('.repoUrl');
    nameContainers.forEach(function(container) {
        container.textContent = repo.name;
    });
    urlContainers.forEach(function(container) {
        container.textContent = repo.repo;
    });

    document.querySelector('#guide').classList.add('show');
}

function hideGuide() {
    document.querySelector('#guide').classList.remove('show');
}

function replaceWithClone(e) {
    e.stopPropagation();
    let td = e.path[2].lastChild;
    if (replacedTd !== td) {
        removeClone();

        replacedTd = td;
        replacedText = replacedTd.textContent;
        replacedTd.textContent = 'git clone ' + replacedText;
        replacedTd.classList.add('clone');
        selectText(replacedTd);
    } else {
        removeClone();
    }
}

function removeClone(e) {
    if (replacedTd) {
        replacedTd.classList.remove('clone');
        replacedTd.textContent = replacedText;
        delete replacedTd;
        delete replacedText;
    }
}

function selectText(element) {
    clearSelection();
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(element);
		window.getSelection().addRange(range);
	}
}

function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}

