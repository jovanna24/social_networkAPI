// imports 'connect' function and the 'connection' object from the 'mongoose' library
// 'connect' used to connect to MongoDB 
// 'connection' reps the active db connection managed by Mongoose
const { connect, connection } = require('mongoose');

// defines MongoDB connection string & name of db
const connectionString = 'mongodb://127.0.0.1:27017/usersDB';

// calls the 'connect' function & passes the 'connectionString'
connect(connectionString);

// exports 'connection' object
module.exports = connection;

