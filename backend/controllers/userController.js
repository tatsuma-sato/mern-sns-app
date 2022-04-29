const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc update a user
// route /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.body;
  let { password } = req.body;
  let data = { ...req.body };

  const { id } = req.params;
  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        data = { ...data, password };
      } catch (error) {
        res.status(500);
        throw new Error("Can't update password");
      }
    }
    try {
      const user = await User.findByIdAndUpdate(userId, { $set: data });

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
        msg: "Account updated",
      });
    } catch (error) {
      res.status(500).json(error);
      throw new Error("Can't update user info");
    }
  } else {
    res.status(403);
    throw new Error("You can update only your account");
  }
});

// @desc delete a user
// @rotue /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.body;
  const { id } = req.params;
  console.log("userId", userId);
  console.log("id", id);
  if (userId === id || isAdmin) {
    try {
      const user = await User.deleteOne({ _id: userId });

      res.status(200).json("Account delete succesfully");
    } catch (error) {
      res.status(500).json(error);
      throw new Error("Can't delete user info");
    }
  } else {
    res.status(403);
    throw new Error("You can delete only your account");
  }
});

// @desc get a user
// @route /api/users
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json(other);
  } catch (error) {
    res.status(500);
    throw new Error("Can't get a user");
  }
});

// @desc follow a user
// @route /api/:id/follow
const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  console.log("userId", userId);
  console.log("id", id);

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      console.log("user", user);
      const currentUser = await User.findById(userId);
      console.log("current user", currentUser);

      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403);
        throw new Error("You already follow this user");
      }
    } catch (error) {
      res.status(500);
      throw new Error("something went wrong");
    }
  } else {
    res.status(403);
    throw new Error("You can't follow yourself");
  }
});

// @desc unfollow a user
// route /api/users/:id/unfollow
const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403);
        throw new Error("You don't follow this user");
      }
    } catch (error) {
      res.status(500);
      throw new Error("something went wrong");
    }
  } else {
    res.status(403);
    throw new Error("You can't unfollow yourself");
  }
});

const getFriends = asyncHandler(async (req, res) => {
  console.log(req.params.userId);
  try {
    const user = await User.findById(req.params.userId);

    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendsList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendsList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
};
