const User = require('../models/User');
const Thought = require('../models/Thought');

const deleteUser = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error('User not found');
    }
    return deletedUser;
}

module.exports = { deleteUser };
