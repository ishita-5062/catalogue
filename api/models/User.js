const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  swipeStreak: { type: Number, default: 0 },
  lastSwiped: { type: Date, default: () => new Date(Date.now() - 24*60*60*1000) }, // Default to yesterday
  didSwipe: { type: Boolean, default: false }
});

// CRUD operations

// Create a new user
async function createUser(userData) {
    console.log("In user.js", userData)
  try {
    console.log("In user.js 2", userData)
    const newUser = new User(userData);
    console.log("In user.js 3", newUser)
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
    return savedUser;
  } catch (error) {
    console.log("Error at user.js create User");
    throw error;
  }
}

// Read user by ID
async function getUserById(id) {
  try {
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
}

// Update user
async function updateUser(id, updateData) {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw error;
  }
}

// Delete user
async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};