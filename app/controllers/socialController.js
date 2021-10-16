const {Account, Post} = require('../schema/models')
const {sortPosts, currentDateTimestamp} = require('../utils/utils')
const {accountExists} = require('../utils/validators')
const {Types: {ObjectId}} = require('mongoose')

const getTimeline = async (req, res) => {
	const {_id} = req.account
	const account = await Account.findById(_id, ['following'])
	const followingIds = [_id, ...(account.following.map(following => following.accountId))]
	let posts = await Post.find({postedBy: followingIds}).populate('postedBy')
	posts.sort(sortPosts)
	res.json({success: true, body: {posts}})
}

const createPost = async (req, res) => {
	const {
		params: { _id },
		body: {content}
	} = req;
	let filename = '';
	if(req.file) 
		filename = req.file.filename
	if(!content && !filename) 
		return res.json({success: false, body: {error: 'A post should contain either content or a media file.'}})
	const post = new Post({
		content: content || '',
		media: filename || '',
		likes: [],
		comments: [],
		accountId: _id,
		postedBy: _id,
		creationDate: currentDateTimestamp(),
	})
	await post.save()
	res.json({success: true, post})
}

const likePost = async (req, res) => {
	const {params: {postId, _id}} = req;
	const post = await Post.findById(postId)
	const likes = post.likes.map(like => like.toString())
	if(likes.includes(_id))
		return res.json({success: false, body: {error: 'Post already liked.'}})
	post.likes.push(_id)
	post.save()
	res.json({success: true, body: {message: 'Post liked.'}})
}


module.exports = {
	getTimeline,
	createPost,
	likePost,
}