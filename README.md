# Siyuan Ren
[![Build Status](https://travis-ci.org/xinbenlv/siyuanren.png?branch=master)](https://travis-ci.org/xinbenlv/siyuanren)
A web app for a THU Siyuan Alumni community.

## Current version: 0.0.0 (dev)
Go to git commit history for details of development

## RESTful API

| URL                       | Action        | Request Object        | Description             |
|---------------------------|---------------|-----------------------|-------------------------|
| /api/siyuan/get/:uid      | GET           | N/A                   | get a siyuan contact    |
| /api/siyuan/put/:uid      | PUT           | obj for mongodb $set  | update a siyuan contact |
| /api/siyuan/delete/:uid   | DELETE        | N/A                   | delete a siyuan contact |
| /api/siyuan/post          | POST          | a Mongoose  doc       | create a siyuan contact |
| /api/query/               | GET           | query object          | query  a siyuan contact |
| /api/publicquery/         | GET           | query object          | query  a siyuan contact for public information  |

Sample Query Obj:
    http://localhost:3000/api/query?collection=SiyuanUserProfile&criteria={"dept":"auto"}

    http://localhost:3000/api/publicquery?collection=SiyuanUserProfile&criteria={"dept":"auto"}&field=["姓名","思源期数"]

## How-Tos

### Prerequisites
The following how-tos assume you are familiar with Git, GitHub, NodeJS, ExpressJS, Javascript.

### Required Environment Variables and Samples
NODE_FLY_ID=xxx...xxx
TWITTER_APP_ID=xxx...xxx
TWITTER_APP_SECRET=xxx...xxx
FACEBOOK_APP_ID=xxx...xxx
FACEBOOK_APP_SECRET=xxx...xxx
LINKEDIN_APP_ID=xxx...xxx
LINKEDIN_APP_SECRET=xxx...xxx
HOST_ROOT_URL="http://localhost:5000"
MONGOHQ_DEV_URL="mongodb://<user>:<password>@<host>:<port>/<db>"
WEIBO_APP_ID="xxx...xxx"
WEIBO_APP_SECRET="xxx...xxx"
RENREN_APP_ID="xxx...xxx"
RENREN_APP_SECRET="xxx...xxx"

### How to release onto Heroku
1. Set up a Heroku nodejs application, [Get Started](https://devcenter.heroku.com/articles/nodejs)
2. Enable Heroku add-on: MongoHq
3. Enable Heroku add-on: Mandrill
  * Note: you will need to configure your DNS to point to Mandrill's smtp server
4. Set up Environment variables:
  heroku config:set ENV_VAR1=env_var1 ENV_VAR2=env_var2 ...
5. Run NPM install in local folder.
  npm install

## FAQ
1. In WebStorm, set up your environment variables, [here is how](http://www.jetbrains.com/webstorm/webhelp/run-debug-configuration-node-js.html).

## Style Guide
* [json](http://google-styleguide.googlecode.com/svn/trunk/jsoncstyleguide.xml)
* [javascript](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* [html/css](http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml)

