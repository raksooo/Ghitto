# Ghitto
Ghitto is a simple git repository manager. It allows you to create repositories and helps you with simple tasks such as cloning and initing.

# Usage
Start with:
```sh
./server.js <port> <path> <ssh login>
```
where <port> represents the port to run the webserver on, <path> is the path to the directory containing the git repositories, and <ssh login> is the username and domain used to clone.

For example:
```sh
./server.js 80 /var/git user@example.com
```

# Screenshots
![Repository created](https://raw.githubusercontent.com/raksooo/ghitto/master/screenshots/repoCreated.png)
![Overview](https://raw.githubusercontent.com/raksooo/ghitto/master/screenshots/overview.png)
![Hovering](https://raw.githubusercontent.com/raksooo/ghitto/master/screenshots/hover.png)
![Cloning](https://raw.githubusercontent.com/raksooo/ghitto/master/screenshots/click.png)
