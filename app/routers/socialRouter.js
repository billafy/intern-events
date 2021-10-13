const { Router } = require("express");
const { getPosts, createPost } = require("../controllers/socialController");
const { verifyAccessToken } = require("../utils/auth");
const { postUpload } = require("../utils/staticStorage");

const router = Router();

router.get("/getPosts/:_id", verifyAccessToken, getPosts);
router.post(
	"/createPost/:_id",
	verifyAccessToken,
	postUpload.single("post"),
	createPost
);

module.exports = router;
