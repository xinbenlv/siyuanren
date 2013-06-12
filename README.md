# Siyuan Ren
[![Build Status](https://travis-ci.org/xinbenlv/siyuanren.png?branch=master)](https://travis-ci.org/xinbenlv/siyuanren)
A web app for a community like siyuan.
Data is stored at data/, which is ignored by git

## Current version: 0.0.0 (dev)
Go to git commit history for details of development

## RESTful API

| URL                       | Action        | Request Object        | Description             |
|---------------------------|---------------|-----------------------|-------------------------|
| /api/siyuan/get/:uid      | GET           | N/A                   | get a siyuan contact    |
| /api/siyuan/put/:uid      | PUT           | obj for mongodb $set  | update a siyuan contact |
| /api/siyuan/delete/:uid   | DELETE        | N/A                   | delete a siyuan contact |
| /api/siyuan/post          | POST          | a Mongoose  doc       | create a siyuan contact |
|---------------------------|---------------|-----------------------|-------------------------|
| /api/query/               | POST          | query object          | create a siyuan contact |

Sample Query Obj:
http://localhost:3000/api/query?collection=SiyuanUserProfile&criteria={"dept":"auto"}

## TODOs and Dones

### To-add external modules
  [ ] Add Mongoose-Filter-Denormalize
  [X] Start using AngularJS
  [X] Use Karma as testing framework
  [ ] Add jasmine
  [ ] Add i18n

### To-add tests
[ ] Write test for authentication



## How-Tos

### Prerequisites
The following how-tos assume you are familiar with Git, GitHub, NodeJS, ExpressJS, Javascript.

### How to release onto GitHub
1. Set up a Heroku nodejs application, [Get Started](https://devcenter.heroku.com/articles/nodejs)
2. Enable Heroku add-on: MongoHq
3. Enable Heroku add-on: Mandrill
 * Note: you will need to configure your DNS to point to Mandrill's smtp server
4. Set up Environment variables:
 * PROJECT_DOMAIN
    heroku config:set PROJECT_DOMAIN=youdomain.com
 * PROJECT_HOSTNAME
    heroku config:set PROJECT_HOSTNAME=www

### How to set up local development environment

1. [Getting Start with NodeJS](https://devcenter.heroku.com/articles/nodejs)
2. Go get your favorite NodeJS/Javascript IDE, WebStorm on OS X is my Choice
3. In WebStorm, set up your environment variables, [here is how](http://www.jetbrains.com/webstorm/webhelp/run-debug-configuration-node-js.html).
4. Set up Environment variables
  * MONGOHQ_DEV_URL, you can get it from MongoHq, [here is how](https://devcenter.heroku.com/articles/mongohq#mongohq-web-tools).
  * MANDRILL_APIKEY, MANDRILL_USERNAME, you can get it from [Mandrill SMTP & API Credentials](https://mandrillapp.com/settings/index)
  * PROJECT_DOMAIN give it your domain name, PROJECT_HOSTNAME give it your host name.
5. Run NPM install in local folder.
    npm install

## Style Guide
[json](http://google-styleguide.googlecode.com/svn/trunk/jsoncstyleguide.xml)
[javascript](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
[html/css](http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml)
