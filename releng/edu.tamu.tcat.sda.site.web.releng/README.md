# Overview
The *.releng project contains the core release engineering artifacts for a Javascript project. This includes
 
 
 
To build. . . 

# Repo Structure

We will use `<product>` to denote the qualified representation of the project being developed. For example, the administrative web interface for the SDA catalogs is identified as `edu.tamu.tcat.sda.catalog.admin` 

The main releng project for a product is managed in an Eclipse project identified as `<product>.releng`. This project is stored under the `<repo>/releng/` directory. It contains following files:

 * package.json 
 * bower.json
 * .bowerrc
 * Gruntfile.js

# Build Workflow

## Prerequisites
Building Javascript-based projects assumes that you have properly configured Node.js for your machine. To do this .... 

Once Node.js has been installed, you must also install the Node module Grunt CLI. To do this, run the following command.

    npm install -g grunt-cli 

Assuming that you want to use Bower for front-end dependency management and that you don't want to install dependencies on each Grunt invocation, you will need to install Bower globally. See the section on Managing Dependencies for more detials. To install Bower, run the following command: 
 
    npm install -g bower
    
Many of our applications use SASS for CSS pre-processing. To use SASS and the associated `grunt-contrib-sass` utilty for Grunt, you will need to have both Ruby and SASS installed on your machine. See <http://sass-lang.com/install> for instructions on how to do this.
    
## Setup the Build Stage
To begin, we need to setup the directory that we will use for building our files and for managing dependencies. 

The project builds are managed from the directory into which the Git repos are cloned. For example, if the project to be built is in `C:\dev\git\sda.catalog.web\`, then the build will be managed from `C:\dev\git\`. We will refer to this directory as the build stage. To begin, we need to copy the build scripts from the project's releng directory into the stage. 

`> cd <stage>`
`> copy <repo>\releng\<product>.releng\package.json .`   
`> copy <repo>\releng\<product>.releng\bower.json .`   
`> copy <repo>\releng\<product>.releng\.bowerrc .`   
`> copy <repo>\releng\<product>.releng\Gruntfile.js .`   

Next, we need to setup the build environment so that Grunt can run. This involves loading the compile time dependencies into a local scope that Node.js can use for this build (as opposed to loading them into the global scope like we did for the Grunt CLI tooling). To do this, run:

    npm install
    
The Node.js modules  referenced in `package.json` will be resolved using the registry at http://npmjs.org and downloaded as needed. This will create a `node_modules` directory within the build stage that contains the declared build dependencies and all required dependencies. 

For example, a common build setup will require Grunt, Grunt's Bower task to resolve runtime dependencies, along with several contributed modules such as Clean, Copy, Cssmin, RequireJs, Sytlus, etc. These contributed modules implement the specific build tasks that will be executed by Grunt.

## Managing Dependencies 
Grunt can use Bower as a step in the build process to manage dependencies automatically. The drawback to this approach is that build will take longer since all dependencies will be evaluated and installed for every Grunt invocation (Grunt does not check existing resources to determine if updates are needed). 

To reduce this overhead, you can run Bower manually and update dependencies as needed when they change. To do this, first make sure that you have the Bower module for Node.js installed globally (see the Prerequisites section) and run the following command:

    bower install
    
This will read `bower.json` and resolves the modules declared in this file and all of their transitive dependencies, downloading them as needed from http://npmjs.org. By default, these runtime dependencies will be stored in the `bower_components` directory of the build stage. Alternatively (and preferably) you can use the `.bowerrc` file to configure which directory is used. 

 
## Executing the Build
To run the build process, simply type the following at the command line:

    grunt [task]
    
Where `[task]` is the name of the task (defined in the `Gruntfile.js` file) to be executed. 

# Files

## package.json

