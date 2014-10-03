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
* Install a really nice code editor
```
#!cmd

C:\> choco install Atom

```
---------------------------------------------------------------------------------

## UPDATE ##

We gonna use a remote mongoDB for everyone can access to the same db, and just need to install a client to access to it.

* Install Robomongo (best graphical interface for MongoDB)

```
#!cmd

C:\> choco install robomongo

```
And to access to it you can use:

```
#!javascript

//dbuser: acteam
//dbpassword: acteamadmin
//default db: acteam
//db port: 31088
//url to db: ds031088.mongolab.com

mongodb://<dbuser>:<dbpassword>@ds031088.mongolab.com:31088/acteam

```

But if you want, you can still install your own mongodb instance:

* Install MongoDB  
```
#!cmd

C:\> choco install mongodb 

```

------------------------------------------------------------------------------------------------------


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

* Get current repository version (replace <your user name here> with your user name eg: jpdias)
```
#!cmd

C:\> git clone https://<your user name here>@bitbucket.org/jpdias/acteam-t05g01.git

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

------------------------------------------------------------------------------------------------------

 In case you don't have the npm's tools variables path defined in your Path file on your windows system do so the following way:
 

* Open cmd.exe as Administrator and execute the following lines:

* First we need the path we are about to define, and we get it be typing the following line:

```
#!cmd

C:\>npm config get prefix

```

Return value should be something like this:  ``` C:\Users\username\AppData\Roaming\npm ```

 
 * Then copy the return path given by the previous command and use it the following way:

```
#!cmd
C:\>set PATH=%PATH%;C:\Users\username\AppData\Roaming\npm;

```

After these three steps you should be able to execute commands like:

```
#!cmd
C:\>nodemon

```

Anywhere on your system.


### Contribution guidelines ###
* The folders are part of NodeJS file structure
* The folder node-modules is where the dependencies of the nodejs are installed after the command *npm install*