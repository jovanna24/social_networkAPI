const { Schema, model, default: mongoose } = require('mongoose'); 
const thoughtSchema = require('./Thought');  
const reactionSchema = require('./Reaction'); 

// Schema to create a new User model
const userSchema = new Schema(
    { 
        username: {
            type: String, 
            unique: true, 
            required: true, 
            trim: true
        }, 
        email: {
            type: String, 
            unique: true, 
            required: true, 
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }, 
        thoughts: [{
            type: mongoose.Types.ObjectId, 
            ref: 'Thought'
        }],
        friends: [{
            type: mongoose.Types.ObjectId, 
            ref: 'User'
        }]

    }
); 

// virtual field for friend account 
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});  

// to ensure friendCounts are included in JSON
// userSchema.set('toJSON', { virtuals: true });

const User = model('User', userSchema); 

module.exports = User;
