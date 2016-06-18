window.onload = fillTable;

var replacedTr;
var replacedTds = [];

function fillTable() {
    emptyTable();
    var repos = retrieveContnent(function(repos) {
        displayContent(repos);
    });
}

function emptyTable() {
    document.querySelector('table').innerHTML = '';
}

function retrieveContnent(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/getRepos', true);

    request.onload = function() {
        if (this.status === 200) {
            callback && callback(JSON.parse(this.response));
        }
    };
    request.send();
}

function displayContent(repos) {
    repos.forEach(function(repo) {
        var tr = document.createElement('tr');
        var td = [
            document.createElement('td'),
            document.createElement('td')
        ]
        td[0].innerText = repo.name;
        td[1].innerText = repo.repo;
        td.forEach(function(t) {
            t.onclick = replaceWithClone;
            tr.appendChild(t);
        });

        document.querySelector('table').appendChild(tr);
    });
}

function newRepo() {
    var name = prompt('name:');
    if (name !== null) {
        var request = new XMLHttpRequest();
        request.open('GET', '/newRepo?name=' + name, true);

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
    removeClone();

    var tr = replacedTr = e.path[1];
    var repo = tr.lastChild.textContent;
    var clone  = 'git clone ' + repo;

    var td = document.createElement('td');
    td.setAttribute('colspan', '2');
    td.classList.add('clone');
    td.textContent = clone;

    var children = tr.children;
    while (children.length > 0) {
        var child = children[0];
        replacedTds.push(child);
        tr.removeChild(child);
    }
    tr.appendChild(td);
    selectText(td);
}

function removeClone(e) {
    if (replacedTds.length > 0) {
        replacedTr.removeChild(replacedTr.children[0]);
        while (replacedTds.length) {
            replacedTr.appendChild(replacedTds.shift());
        }
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

