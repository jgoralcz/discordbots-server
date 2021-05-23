# Overview
A Node.js microservice to account for user voting and updating the guild count to discord bots.

# Stack (Node)
1. express
2. axios (interact with main API)
3. log4js
4. express-promise-router
5. express-basic-auth

# Setup
1. Config file setup similar to below
```
{
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
  "voteChannel": "1234",
  "api": {
    "host": "localhost",
    "port": 8443,
    "password": "basic",
    "username": "auth"
  },
}
```
2. Run the Dockerfile or `node src/server.js`
