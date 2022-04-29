const router = require("express").Router();
const {
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAllPosts,
  getUserAllPosts,
} = require("../controllers/postController");

router.get("/timeline/:userId", getAllPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/profile/:username", getUserAllPosts);

module.exports = router;
