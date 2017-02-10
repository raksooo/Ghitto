# Ghitto
Ghitto is a minimalistic git repository manager. It allows you to create repositories and helps you with simple tasks such as cloning and initing.

# Install
```sh
npm install -g ghitto
```

# Usage
Start with:
```sh
ghitto <port> <path> <ssh> [<read-only>]
```
where \<port\> represents the port to run the webserver on, \<path\> is the path to the directory containing the git repositories, and \<ssh login\> is the username and domain used to clone. \<read-only\> is a boolean which disables the possibility to add repositiories and directiories (default is false).

For example:
```sh
ghitto 80 /var/git git@example.com

ghitto 80 /var/git git@example.com true
```

# Screenshots
<img src="https://github.com/raksooo/Ghitto/raw/master/screenshots/repoCreated.png" width="400" />
<img src="https://github.com/raksooo/Ghitto/raw/master/screenshots/overview.png" width="400" />
<img src="https://github.com/raksooo/Ghitto/raw/master/screenshots/hover.png" width="400" />
<img src="https://github.com/raksooo/Ghitto/raw/master/screenshots/click.png" width="400" />

