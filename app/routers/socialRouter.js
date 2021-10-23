const { Router } = require("express");
const {
	getTimeline,
	createPost,
	likePost,
	followAccount,
	getPosts,
	commentPost,
} = require("../controllers/socialController");
const { verifyAccessToken } = require("../utils/auth");
const { postUpload } = require("../utils/staticStorage");

const router = Router();

router.get("/getPosts/:_id", getPosts);
router.get("/getTimeline/:_id", verifyAccessToken, getTimeline);
router.post(
	"/createPost/:_id",
	verifyAccessToken,
	postUpload.single("post"),
	createPost
);
router.put("/likePost/:postId", verifyAccessToken, likePost);
router.put("/followAccount/:accountId", verifyAccessToken, followAccount);
router.put("/commentPost/:postId", verifyAccessToken, commentPost);

module.exports = router;
