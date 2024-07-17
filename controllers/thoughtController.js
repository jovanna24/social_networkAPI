const { Thought, User, Reaction } = require('../models'); 

module.exports = {
    // get all thoughts 
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().sort({ createAt: -1}); 
            res.status(200).json(thoughts); 
        } catch (err) {
            res.status(500).json(err);
        }
    }, 

    // get a single thought 
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if(!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            } 
            res.status(200).json(thought); 
        } catch(err)  {
            res.status(500).json(err);
        }
    }, 

    // post a new thought 
    async createThought (req, res) {
        try {
            const { username, thoughtText } = req.body; 
            const newThought = await Thought.create({ username, thoughtText }); 

            // add thought id to thought 
            await User.findOneAndUpdate(
                { username: username }, 
                { $push: { thoughts: newThought._id } },
                { new: true }
            ); 
            res.status(201).json(newThought);
        } catch(err) {
            res.status(400).json(err);
        }
    }, 

    // PUT/update a thought 
    async updateThought (req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId, 
                req.body, 
                { new:true }
            );
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.status(200).json(updatedThought);
        } catch (err) {
            res.status(400).json(err);
        }
    }, 

    // deleteThought by ID 
    async deleteThought (req, res) {
        try{
            const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
            if (!deletedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            // remove this thought from user's thoughts array 
            await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId }, 
                { $pull: { thoughts: req.params.thoughtId } }
            );

            // await reactionSchema.deleteMany(
            //     { thoughtId: req.params.thoughtId }
            // );  
            res.status(200).json({ message: 'Thought deleted successfully' }); 
        } catch (err) {
            res.status(400).json({ message: 'Failed to delete thought', error: err.message });        }
    },
    // addReaction, POST a reaction to a thought 
    async addReaction(req, res) {
        try{
            const { thoughtId } = req.params;
            const { reactionBody, username } = req.body;

            const newReaction = { reactionBody, username }; 
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId, 
                { $push: { reactions: newReaction } }, 
                { new: true }
            ); 
            if(!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' }); 
            }
            res.status(201).json(updatedThought);
        } catch(err) {
            res.status(400).json(err); 
        }
    }, 
    // removeReaction, delete a reaction from a thought 
    async removeReaction(req, res) {
        try{
            const updatedThought = await Thought.findByIdAndDelete(
                thoughtId, 
                { $pull: { reactions: { _id: reactionId } } },
                { new: true }
            ); 
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.status(200).json(updatedThought);
        } catch (err) {
            res.status(400).json({ message: 'Failed to delete reaction', error: err.message });        }
    }
};