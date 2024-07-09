const { ObjectId } = require('mongoose').Types; 
const { User, Thought, Reaction } = require('../models'); 

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find(); 

            const userObj = {
                users, 
                
            }
        }
    }
}