const express = require("express");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const { follow } = require("../controllers/user");

// POST user/:id/follow
router.post("/:id/follow", isLoggedIn, follow); // :id는 내가 팔로우하는 대상의 id가 될것이다. req.params.id / req.user.id는 내id

module.exports = router;
