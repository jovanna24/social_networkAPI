const Thought = require('../models/Thought');

const removeAssociatedThoughts = async (thoughtIds) => {
    try {
        // Remove thoughts where _id is in thoughtIds array
        await Thought.deleteMany({ _id: { $in: thoughtIds } });
    } catch (err) {
        throw new Error('Failed to delete associated thoughts');
    }
};

module.exports = {
    removeAssociatedThoughts
};
