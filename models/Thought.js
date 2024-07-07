const { Schema, model } = require('mongoose'); 
const userSchema = require('./User'); 
const reactionSchema = require('./Reaction'); 

// schema to create thought model 
const thoughtSchema = new Schema( 
    {
        thoughtText: {
            type: String, 
            required: true, 
            minLength: 1, 
            maxLength: 280
        }, 
        createdAt: {
            type: Date, 

        }, 
        username: {
            type: String, 
            required: true
        }, 
        reactions: [Reaction.schema]
    }
); 

// virtual for reactionCount 
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
}); 

// to make sure reactionCount is included in output
// thought.Schema.set('toJSON', {virtuals: true });

const Thought = model('Thought', thoughtSchema); 

module.exports = Thought; 