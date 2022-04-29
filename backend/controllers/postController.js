const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// @desc create a post
// @route /api/posts
const createPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);

  try {
    const post = await Post.create({
      ...req.body,
      user: user.id,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500);
    throw new Error("Can't create a post");
  }
});

// @desc update a post
const updatePost = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated");
    } else {
      res.status(403);
      throw new Error("You can only update your post");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("post has been deleted");
    } else {
      res.status(403);
      throw new Error("You can only delete your post");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});

// @desc like a post
const likePost = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("post has been disliked");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong");
  }
});
// @desc get a post
const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(403);
    throw new Error("Couldn't get a post");
  }
});

// @desc timeline posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendsPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendsPosts));
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc timeline posts
const getUserAllPosts = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAllPosts,
  getUserAllPosts,
};
