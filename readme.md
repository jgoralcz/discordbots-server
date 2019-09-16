# Overview
A Node.js microservice to account for user voting and updating the guild count to discord bots. \
Additionally, a cron job is ran against the database to reset needed data.

# Stack (Node)
1. Express
2. Mocha and request-promise (for testing)
3. Log4js
4. express-promise-router
5. express-basic-auth

# Setup
1. Config file setup similar to below (for database help look at the ddl.sql file)
```
{
  "db": {
    "user": "josh",
    "host": "host",
    "database": "database",
    "password": "password",
    "max": 3,
    "connectionTimeoutMillis": 30000,
    "idleTimeoutMillis": 2000,
    "port": 4201
  },
  "dbl": {
    "pass": "password",
    "host": "127.0.0.1",
    "port": 30001,
    "token": "token"
  },
  "maxStreak": 10,
  "streakAmount": 250,
  "password": "hashed_pass",
  "actual_pass": "actual_pass",
  "username": "hashed_name",
  "actual_username": "name",
  "port": 8999,
  "updateServer": "ip",
  "updatePort": 8998,
  "voteChannel": "1234",
  "prefix": "x"
}
```
2. Run the dockerfile or `node src/app.js`

# Testing
I use mocha for testing. Use `npm test`



###### side note: to view in vscode follow this https://code.visualstudio.com/docs/languages/markdown
