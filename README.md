# Network. Practical task

Link to [ebook](https://ebook.learn.epam.com/node-gmp/docs/network/task).

Suppose we have traveled back in time to the early days of Node.js when no frameworks existed. Engineers had to create REST APIs from scratch, using basic Node.js and its standard libraries. Thankfully, Node.js ecosystem has since progressed significantly. Nevertheless, let's try to implement a simple REST API using Node.js only. Are you ready to touch the core?

## Description
Implement REST API based on [Swagger](https://autocode.git.epam.com/ld-autocode-js-programs/nodejs-gmp/nodejs-gmp-template/-/blob/module-4-network/swagger.yaml?ref_type=heads) following REST API principles and not violating constraints. Data should be stored in memory as an array. Input validation and authentication can be skipped. Try to think of modular structure for the task. Please do not have all the implementation in one file. You can use the following [Postman collection](https://autocode.git.epam.com/ld-autocode-js-programs/nodejs-gmp/nodejs-gmp-template/-/blob/module-4-network/app.postman_collection.json?ref_type=heads) to test your API.


## API description

1. ```POST /api/users``` - creates new user (id = uuid)
2. ```GET /api/users``` - returns a list of users stored 
3. ```DELETE /api/users/:userId``` - deletes a specific user by id
4. ```GET /api/users/:userId/hobbies``` - returns list of hobbies added for user
5. ```PATCH /api/users/:userId/hobbies``` - updates user hobbies: 

   * if there are no hobbies for the user, new hobbies are added.
   ```
   before update: hobbies = []
   hobbies to add: ['sport', 'dancing']
   after update: hobbies = ['sport', 'dancing']
   ```
   * if there are some hobbies for the user, new hobbies are added to existing ones
   ```
   before update: hobbies = ['sport']
   hobbies to add: ['dancing']
   after update: hobbies = ['sport', 'dancing']
   ```
   
    * if there are some hobbies for the user and we try to add the ones that are already added, then duplicates are removed
    ```
   before update: hobbies = ['sport', 'dancing']
   hobbies to add: ['dancing']
   after update: hobbies = ['sport', 'dancing']
   ```

## Acceptance criteria

1. No frameworks are used. Server is created using [http](https://nodejs.org/api/http.html) module.
   * Server should be started using ```npm start``` command and stopped by ```npm run stop``` (see Hint 1). Server is running on ```8000``` port.
2. API implementation follows (Swagger)[https://autocode.git.epam.com/ld-autocode-js-programs/nodejs-gmp/nodejs-gmp-template/-/blob/module-4-network/swagger.yaml?ref_type=heads]. Pay attention to:
   * Content-Type is ```application/json``` for requests and responses.
   * HTTP status codes returned (not only 200, but there are also 201 when user is created or 404 when user is not found).
3. Caching headers are added for getting list of users and hobbies for a specific user. Think which one should be public and which one private. Cache is valid for 3600 seconds.
   * No need to implement the caching layer itself, adding headers is enough at this point.
4. Hypermedia links (HATEOAS) are included for:
   * Each user to retrieve their hobbies
   * Get hobbies for a specific user - a reference to the user itself

## Evaluation criteria

- [x] Server is created using [http](https://nodejs.org/api/http.html) module, no frameworks are used
- [x] Commands to start and stop server are added to package.json
- [x] ```POST /api/users``` - create user endpoint is implemented based on Swagger
- [x] ```GET /api/users``` - get users endpoint is implemented based on Swagger
- [x] ```DELETE /api/users/:userId``` - delete user endpoint is implemented based on Swagger
- [x] ```GET /api/users/:userId/hobbies``` - get user hobbies endpoint is implemented based on Swagger
- [x] ```PATCH /api/users/:userId/hobbies``` - update user hobbies endpoint is implemented based on Swagger
- [x] Proper caching headers are added for getting list of users and hobbies for a specific user
- [x] Hypermedia links (HATEOAS) are included into responses

## Hints
The hints below will help you to solve our task. Feel free to skip them if you feel the true power!

### Hint 1 - Start and stop server
You can use [pm2](https://www.npmjs.com/package/pm2) to simply start and stop your server. Here are the steps to follow:

```
// step 1 - install pm2

npm i pm2 --save-dev

// step 2 - add start command to package.json

"scripts": {
...
"start": "./node_modules/.bin/pm2 start {path_to_index_file} --name ngmp-network-app",
...
}

// step 3 - add stop command to package.json

"scripts": {
...
"stop": "./node_modules/.bin/pm2 stop ngmp-network-app",
...
}
```


### Hint 2 - Parse request body
The function ```parseRequestBody()``` subscribes to request data events that contain data sent in the request body. Once all the data is received, promise is resolved and the object that contains data sent is returned. If there is an error, promise is rejected.

```
export const parseRequestBody = (req) => new Promise((resolve, reject) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    resolve(JSON.parse(body));
  });

  req.on('error', (error: Error) => {
    reject(error);
  });
});

const reqBody = await parseRequestBody(req);
```

