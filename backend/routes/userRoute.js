const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser,
  getFriends,
} = require("../controllers/userController");

router.get("/", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/friends/:userId", getFriends);

module.exports = router;
