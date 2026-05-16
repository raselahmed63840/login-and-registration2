const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};