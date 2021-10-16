const { Router } = require("express");
const { getTimeline, createPost, likePost } = require("../controllers/socialController");
const { verifyAccessToken } = require("../utils/auth");
const { postUpload } = require("../utils/staticStorage");

const router = Router();

router.get("/getTimeline/:_id", verifyAccessToken, getTimeline);
router.post(
	"/createPost/:_id",
	verifyAccessToken,
	postUpload.single("post"),
	createPost
);
router.put('/likePost/:postId/:_id', verifyAccessToken, likePost);

module.exports = router;
