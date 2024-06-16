
# cloudSEK posts and comments

Welcome to the basic Post-Comments Service that I've developed! This service is designed to allow users to perform CRUD operations via a RESTful API on text-based posts. Additionally, it enables interaction by allowing users to comment on these posts. Whether you're creating, reading, updating, or deleting posts, or engaging through comments, this service provides a streamlined experience for managing and interacting with textual content


## Documentation

API Documentation : [API Documentation](https://documenter.getpostman.com/view/29325961/2sA3XQi2eM)


## Deployment

Download the project and follow these steps:

Open the project using VS code  
navigate yourself to api folder
and run these commands in terminal

step:1 
```bash
  npm install
```

step:2 
```bash
  npm start
```

After this service will be ready to run on your local environment.
OPen your postman and  make requests.


## POSTMAN settings

To make requests on postman do the Following things

1) Login and Signup Requests Setup:

When making a request for login or signup in Postman, you'll want to include the following in the "Tests" tab of your request. This script will extract the JWT token from the response and store it as an environment variable named "jwt":


`pm.environment.set("jwt",pm.response.json().token);`

Make sure this script is placed in the "Tests" tab of your request in Postman.

2) Setting Authorization with Bearer Token:

For every subsequent request that requires authentication (i.e.,All routes except login and signup),

After executing the login or signup request and storing the JWT token in the environment variable, follow these steps to set up the Authorization header:

Click on the "Authorization" tab in Postman.
Select "Bearer Token" from the dropdown list.
In the input field next to "Bearer Token", enter {{jwt}}. This syntax references the environment variable where the JWT token is stored.


