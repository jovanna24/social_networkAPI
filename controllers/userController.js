const { ObjectId } = require('mongoose').Types; 
const { User, Thought, Reaction } = require('../models'); 

module.exports = {
    // method to get all users
    async getUsers(req, res) {
        try {
            const users = await User.find(); 
            res.status(200).json(users); 
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    // method to get a single user by ID
    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.userId); 
            if (!user) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            res.status(200).json(user); 
        } catch (err) {
            res.status(500).json(err); 
        }
    },

    // method to create a new user 
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body); 
            res.status(200).json(newUser);
        } catch (err) {
            res.status(201).json(err);
        } 
    }, 

    // method to update an existing user by ID 
    async updateUser(req, res) {
        try{ 
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(400).json(err); 
        }
    }, 

    // method to delete a user by ID
    async deleteUser(req, res) {
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.userId); 
            if(!deletedUser) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            // delete related thoughts and reactions 
            await Thought.deleteMany({ user: req.params.userId }); 
            await Reaction.deleteMany({ user: req.params.userId }); 

            res.status(200).json({ message: 'User deleted successfully! '}); 
        } catch (err) {
            res.status(400).json(err); 
        }
    }, 

    // method to add a friend 
    async addFriend(req, res) {
        try{
            const user = await User.findById(req.params.userId); 
            const friendId = req.body.friendId; 

            if (!user) {
                return res.status(404).json({ message: 'User not found' }); 
            }
            if (user.friends.includes(friendId)) {
                return res.status(400).json({ message: 'Already friends!' });
            }
            user.friends.push(friendId); 
            await user.save(); 

            res.status(200).json(user); 
        } catch (err) {
            res.status(400).json(err); 
        }
    },

    // method to remove a friend
    async removeFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId); 
            const friendId = req.body.friendId; 
            if(!user) {
                return res.status(404).json({
                    message: 'User not found' 
                });
            }
            if (!user.friends.includes(friendId)) {
                return res.status(400).json({ message: 'Not friends' }); 
            }
            // explain this line of code
            user.friends = user.friends.filter(f => f.toString() !== friendId.toString());
            await user.save(); 

            res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    }
};