const router = require("express").Router();
const {
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getAllPosts,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);

module.exports = router;
