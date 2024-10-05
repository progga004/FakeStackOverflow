
# Fake Stack Overflow

 This project is a clone of the popular website Stack Overflow.




## Authors

- [Progga Paromita Dutta]
- [Kamrul Hassan]
  
## Admin credentials 
- username: **kam**
- password: **progga**
- email: **cse316@stonybrook.edu**

You will need these **credentials** to initialize your **database** and  to login as admin 

## Installation requirements and Running the program

### Database: MongoDB

1. Please install MongoDB a no SQL database
2. please refer to the [link](https://www.mongodb.com/docs/manual/administration/install-community/) to install MongoDB
3. On Windows, you should unselect the option “MongoDB as a Service” to complete the installation. 
4. After you install it, follow the instructions to start MongoDB as a background service.

### Webserver: Node
1. Install node with the following [link](https://nodejs.org/en/download/)
2. We will use Node to install all of our dependencies 

### Run the program

***We will be using bash as our terminal***
1. please open up a terminal of your choice and run the following command. You can also run this in any folder

```bash
git clone https://github.com/sbu-ckane-f23-cse316-projectorg/projectfakeso-kam_progga.git
```
2. change to the project directory and install dependencies on both client and server 

``` bash
cd projectfakeso-kam_progga/client
npm install 
```
***After installing node you will see node_modules in your client folder***

3. After node is installed in the client directory change to the 
**server** directory

```bash
cd ..
cd server
npm install
```
***After installing node you will see node_modules in your server folder***

4. Initialize your databse for MongoDB

5. Start MongoDB if not already

**Please open another terminal**

7. go to the server directory and run the init.js with the admin credential mentioned at the very top of this document:

    ```bash
    cd projectfakeso-kam_progga/client
    cd server
    cd init.js kam progga
    ```
8. Start you node webserver

```bash 
nodemon server.js
```
**Please open another terminal**

8. finally run your client in the client directory 

```bash
cd projectfakeso-kam_progga/client
cd client
npm start 
```

9. Finally, your client will run on **localhost:3000** and your server on **localhost:8000**

    
## Contribution by team members
### Kamrul Hassan
- Created Home page
- Post a new Question
- Created question form
- Search by Text
- Search by tags
- landing page
- JWT authentication
- README.md
- UML diagram
- init.js of the MongoDB
### Progga Paromita Dutta
- Created answer Form
- Created Answer Page
- Post a new answer
- Questions of a tag
- All Tags Page
- Adds error message to form
- upvote/downvote components
- admin and user profile 
- comments to questions and answers 


