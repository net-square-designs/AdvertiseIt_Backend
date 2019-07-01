[![CircleCI](https://circleci.com/gh/net-square-designs/Errnd/tree/develop.svg?style=svg)](https://circleci.com/gh/net-square-designs/Errnd/tree/develop)
[![Coverage Status](https://coveralls.io/repos/github/net-square-designs/Errnd/badge.svg?branch=develop)](https://coveralls.io/github/net-square-designs/Errnd?branch=develop)

# Errnd
## Description
Errnd is a platform where your errands are completed by your communities

## Technologies
  * Node.js
  * Express
  * Mocha/Chai
  * Eslint
  * Babel

## API Link
[Link](https://errnd.herokuapp.com/api/v1)

## Documentation
[Link](https://errnd.docs.apiary.io/#)

## API Routes
* Register a user

    ``` 
    POST /auth/signup
    ```
* Login a user

    ``` 
    POST /auth/login 
    ```
* Create a profile

    ``` 
    POST /profile/:username
    ```
* View a profile

    ``` 
    GET /profile/:username 
    ```
* Switch roles

    ``` 
    PUT /role/:username
    ```
* Create a service

    ``` 
    POST /services/:username 
    ```
* Update a service

    ``` 
    PUT /services/:username/update/:serviceId 
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
 
   * http://localhost:3005/api/v1
   
 * Run test with
 
   * npm test

