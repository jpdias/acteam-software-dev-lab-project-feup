# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Laboratório de Desenvolvimeto de Software
* FEUP -  Faculdade de Engenharia da Universidade do Porto

### How do I get set up? ###

* Install [Chocolatey](http://chocolatey.org/) => Run command prompt with admin permissions.
```
#!cmd

C:\> @powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
```
*Install a really nice code editor
```
#!cmd

C:\> choco install atom

```

* Install MongoDB  
```
#!cmd

C:\> choco install mongodb 

```
* Install Node.js
```
#!cmd

C:\> choco install nodejs

```

* Install nodemon
```
#!cmd

C:\> npm install -g nodemon

```

* Get current repository version
```
#!cmd

C:\> git clone https://jpdias@bitbucket.org/jpdias/acteam.git

```
* Open folder in cmd and execute (to install dependencies):
```
#!cmd

C:\> npm install

```
* To start the server (Open two cmd's)
	* Init mongodb server (the dbpath can be anything that you want)
```
#!cmd

C:\> mongod --dbpath "C:/MongoDB"

```

* Init NodeJS server

```
#!cmd

C:\> nodemon

```

* ## And now the server is running on [http://localhost:3000](http://localhost:3000) ##


### Contribution guidelines ###

* The ember part (front-end) is in the folder views and the dependencies in the folder public 
* The other folders are part of server side (NodeJS)
* The folder node-modules is where the dependencies of the nodejs are installed after the command *npm install*