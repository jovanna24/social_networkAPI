// imports and config 
const express= require('express'); 
const db = require('./config/connection'); 
const routes = require('./routes'); 

// retrieves the current working directory of the Node.js process 
const cwd = process.cwd();  

const PORT = process.env.PORT || 3001; 
const app = express(); 

// helps indicate what activity's server is running in the terminal
const activity = cwd.includes('01-Activities')
    ? cwd.split('01-Activities')[1]
    : cwd; 

// Middleware setup

// middleware to parse incoming request bodies with URL-encoded-payloads
app.use(express.urlencoded({ extended: true })); 
// parse incoming request bodies as JSON
app.use(express.json()); 
// mounts imported routes onto application 
app.use(routes); 

// Establishes a MongoDB connection and listens for the 'open' event
// Once the connection is open, it starts the Express server
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server for ${activity} running on port ${PORT}!`);
    });
});
