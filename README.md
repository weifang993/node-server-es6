# Node Server ES6

This project is intended to test out node server with ES6.  It is based on instructions from
Babel website and this video: https://egghead.io/lessons/node-js-using-es6-and-beyond-with-node-js#/tab-code.
Known issue: Need to find a way to effectively debug ES6 code with Visual Studio Code.

## Components and Features

This test uses the following components and features:

 * NodeJS/Express
 * ES6 
 * Babel 
 * Docker

## Install dependencies

After cloning the repo execute `npm install` to install all dependencies. 

## Run the application

* `npm run dev` -- Run server in dev environment. 'nodemon' is used to call babel auto-transpile the changes.
* `npm run start` -- Build (transpile) the code to dist directory before running the server.

## Run Docker Hub image  

A prebuilt Docker image of this POC is located at https://hub.docker.com/r/weifang993/node-server-es6/. 
From any operating system that supports Docker, you can run the image by typing: `[sudo] docker run -d -p 3000:3000 weifang993/node-server-es6`.
The Docker image will be automatically downloaded from Docker Hub before the container runs. 
Verify the REST service is running by going to `http://localhost:3000/api/legal_entities`. 

## Build Docker image

You can optionally build the image yourself and run it by following instructions from: https://docs.docker.com/ or simply type the following while in the project directory: `[sudo] docker build -t weifang993/node-server-es6 .`.
