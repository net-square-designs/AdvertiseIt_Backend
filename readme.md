[![CircleCI](https://circleci.com/gh/net-square-designs/Errnd/tree/develop.svg?style=svg)](https://circleci.com/gh/net-square-designs/AdvertiseIt/tree/develop)
[![Coverage Status](https://coveralls.io/repos/github/net-square-designs/AdvertiseIt_Backend/badge.svg?branch=develop)](https://coveralls.io/github/net-square-designs/AdvertiseIt_Backend?branch=develop)

# AdvertiseIt
## Description
AdvertiseIt is a platform that enables you to do social commerce

## Technologies
  * Node.js
  * Express
  * Mocha/Chai
  * Eslint
  * Babel

## API Link
[Link](https://advertiseit-backend.herokuapp.com/api/v1)

## Documentation
[Link](https://advertiseit1.docs.apiary.io/#)

## API Routes
* Register a user

    ``` 
    POST /auth/signup
    ```
* Login a user

    ``` 
    POST /auth/login 
    ```
* Login through social media - Facebook

    ``` 
    GET /auth/facebook
    ```
    ``` 
    GET /auth/facebook/callback
    ```

## Installation
 * Ensure you have node 10.x.x installed.
 
 * Install node modules with the command
 
   * npm install
   
 * Start the API server with command
 
   * npm start

* Start the API development server with command
 
   * npm run start:dev
   
 * Check API index with Postman
 
   * http://localhost:3006/api/v1
   
 * Run test with
 
   * npm test

