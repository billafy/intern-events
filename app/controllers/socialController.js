const { Account, Post } = require("../schema/models");
const { sortPosts, currentDateTimestamp } = require("../utils/utils");
const { accountExists } = require("../utils/validators");
const {
	Types: { ObjectId },
} = require("mongoose");
const { idify } = require("../utils/utils");

const commentPopulate = {
	path: 'comments',
	populate: {
		path: 'commentedBy',
	}
}

const getTimeline = async (req, res) => {
	const { _id } = req.account;
	const account = await Account.findById(_id, ["following"]);
	const followingIds = [
		_id,
		...account.following.map((following) => following),
	];
	console.log(followingIds);
	let posts = await Post.find({ postedBy: followingIds }).populate(
		"postedBy"
	).populate(commentPopulate);
	posts.sort(sortPosts);
	res.json({ success: true, body: { posts } });
};

const getPosts = async (req, res) => {
	const { _id } = req.params;
	const posts = await Post.find({ postedBy: _id }).populate("postedBy").populate(commentPopulate);
	posts.sort(sortPosts);
	res.json({ success: true, body: { posts } });
};

const createPost = async (req, res) => {
	const {
		params: { _id },
		body: { content },
	} = req;
	let filename = "";
	if (req.file) filename = req.file.filename;
	if (!content && !filename)
		return res.json({
			success: false,
			body: {
				error: "A post should contain either content or a media file.",
			},
		});
	const post = new Post({
		content: content || "",
		media: filename || "",
		likes: [],
		comments: [],
		accountId: _id,
		postedBy: _id,
		creationDate: currentDateTimestamp(),
	});
	await post.save();
	res.json({ success: true, post });
};

const likePost = async (req, res) => {
	const {
		params: { postId },
	} = req;
	const _id = req.account._id.toString();
	let post = await Post.findById(postId).populate("postedBy").populate(commentPopulate);
	if (!post)
		return res.json({
			success: false,
			body: { error: "Post does not exists." },
		});
	const likes = post.likes.map((like) => like.toString());
	if (likes.includes(_id))
		post.likes = post.likes.filter((like) => like.toString() !== _id);
	else post.likes.push(_id);
	await post.save();
	res.json({ success: true, body: { post } });
};

const commentPost = async (req, res) => {
	const {
		params: { postId },
		body: { text },
	} = req;
	const _id = req.account._id.toString();
	let post = await Post.findById(postId);
	if (!post)
		return res.json({
			success: false,
			body: { error: "Post does not exists." },
		});
	if (!text)
		return res.json({
			success: false,
			body: { error: "Comment cannot be empty." },
		});
	post.comments = idify([
		...post.comments,
		{ text, commentedBy: _id, likes: 0 },
	]);
	await post.save();
	post = await Post.findById(postId).populate('postedBy').populate(commentPopulate)
	res.json({ success: true, body: { post } });
};

const followAccount = async (req, res) => {
	const {
		params: { accountId },
	} = req;
	const _id = req.account._id.toString();
	const followingAccount = await Account.findById(accountId);
	if (!followingAccount)
		return res.json({
			success: false,
			body: { error: "Account does not exists." },
		});
	let account = await Account.findById(_id);
	if (account.following.includes(accountId)) {
		followingAccount.followers = followingAccount.followers.filter(
			(follower) => follower !== _id
		);
		account.following = account.following.filter(
			(following) => following !== accountId
		);
	} else {
		followingAccount.followers.push(_id);
		account.following.push(accountId);
	}
	await followingAccount.save();
	await account.save();
	res.json({ success: true, body: { account, followingAccount } });
};

module.exports = {
	getPosts,
	getTimeline,
	createPost,
	likePost,
	followAccount,
	commentPost,
};
