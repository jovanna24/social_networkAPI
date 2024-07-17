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
            // await reactionSchema.deleteMany({ user: req.params.userId }); 

            res.status(200).json({ message: 'User deleted successfully! '}); 
        } catch (err) {
            res.status(400).json({ message: 'Failed to delete user', error: err.message });
        }
    }, 

    // method to add a friend 
    async addFriend(req, res) {
        try {
            const userId = req.params.userId;
            const { friendId } = req.body; // Destructure friendId from req.body

            if (!friendId) {
                return res.status(400).json({ message: 'Friend ID is required' });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId }, 
                { $addToSet: { friends: friendId } }, // Use $addToSet to avoid adding duplicates
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (err) {
            console.error('Error adding friend:', err);
            res.status(500).json({ message: 'Failed to add friend', error: err.message });
        }
    },

    // method to remove a friend
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId }, 
                { $pull: { friend: { friendId: req.params.friendId } } },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res
                .status(404)
                .json({ message: 'No user found with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'Failed to remove friend', error: err.message });
        }
    }
};