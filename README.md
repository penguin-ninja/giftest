# Giftest

[![Build Status](https://travis-ci.com/socialsweetheartsgmbh/giftests.svg?token=VxhwSh6sNxL2ihNehWen&branch=master)](https://travis-ci.com/socialsweetheartsgmbh/giftests)

## Getting Started

### Set Up Node JS
The application runs on node 7.10. You can control different node versions with [node version manager](https://github.com/creationix/nvm).
Follow its setup guide to install nvm on your machine.

Check what node versions are there after installation.
`$ nvm list`
That should say nothing in the beginning.

Now pull latest node store paths.
`$ nvm ls-remote`

Install Node 7.10
`$ nvm install 7.10`

Set 7.10 as default node version.
`$ nvm alias default 7.10`

### Install pm2
`$ npm install -g pm2`

### Install MongoDB

### Set Up Environment Variables

There is .env-example file in the repository.
`$ cp .env-example .env`

Mongo URL is not used at the moment.

### Set up dependencies
`$ npm install`

### Running App in development mode
`$ npm run dev`

### Running app in production mode

`$ npm run build`

`$ npm run build:server`

`$ npm start`

## Deployment

### Copy pem file
`$ mkdir .pem`

`$ cp /path/to/your_key.pem ./.pem/deploy_key.pem`

`$ chmod 400 ./.pem/deploy_key.pem`

### Deploying to dev server
`$ pm2 deploy development`

### Contribution Guide
