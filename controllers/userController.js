const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render('profile', { user });
};
