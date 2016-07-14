window.onload = function() {
    loadContent();
};

let replacedTd;
let replacedText;

let currentDir = '';

function loadContent(relative) {
    if (typeof relative === 'undefined') {
        relative = currentDir;
    }
    currentDir = relative;

    clear();
    retrieveContnent(({git, other}) => {
        displayContent(git);
        displayDirs(other, relative.length > 0);
        displayPath();
    });
}

function clear() {
    document.querySelector('nav#directories').innerHTML = '';
    document.querySelectorAll('table tr:not(:first-child)').forEach(element => {
        element.parentNode.removeChild(element);
    })
}

function retrieveContnent(callback) {
    let request = new XMLHttpRequest();
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
        let a = document.createElement('span');
        a.textContent = '..';
        a.setAttribute('onclick', ';');
        let _current = currentDir.slice(0, -1);
        _current = _current.substr(0, _current.lastIndexOf('/') + 1);
        a.onclick = loadContent.bind(this, _current);
        document.querySelector('nav#directories').appendChild(a);
    }

    dirs.forEach(dir => {
        let a = document.createElement('span');
        a.textContent = dir;
        a.setAttribute('onclick', ';');
        a.onclick = loadContent.bind(this, currentDir + dir + '/');
        document.querySelector('nav#directories').appendChild(a);
    });
}

function displayContent(repos) {
    repos.forEach(({name, repo}) => {
        let tr = document.createElement('tr');
        let td = [
            document.createElement('td'),
            document.createElement('td')
        ]
        let span = document.createElement('span');
        span.innerText = name;
        span.setAttribute('onclick', ';');
        span.onclick = replaceWithClone;
        td[0].appendChild(span);
        td[1].innerText = repo;
        td.forEach(t => {
            tr.appendChild(t);
        });

        document.querySelector('table').appendChild(tr);
    });
}

function newRepo() {
    let name = prompt('name:');
    if (name !== null) {
        let request = new XMLHttpRequest();
        request.open('GET', '/newRepo?path=' + encodeURIComponent(currentDir)
                + '&name=' + name, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                let response = JSON.parse(this.response);
                if (!response.error) {
                    loadContent();
                    fillGuide(response);
                } else {
                    alert(response.error);
                }
            }
        };
        request.send();
    }
}

function fillGuide({name, repo, clone}) {
    let nameContainers = document.querySelectorAll('.repoName');
    let urlContainers = document.querySelectorAll('.repoUrl');
    nameContainers.forEach(container => {
        container.textContent = name;
    });
    urlContainers.forEach(container => {
        container.textContent = repo;
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
        clearSelection();
        replacedTd.classList.remove('clone');
        replacedTd.textContent = replacedText;
        replacedTd = undefined;
        replacedText = undefined;
    }
}

function selectText(element) {
	if (document.selection) {
		let range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		let range = document.createRange();
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

function displayPath() {
    document.querySelector('div#path').textContent = '/' + currentDir;
}

