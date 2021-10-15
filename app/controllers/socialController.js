const {Account, Post} = require('../schema/models')
const {currentDateTimestamp} = require('../utils/utils')
const {accountExists} = require('../utils/validators')

const getPosts = async (req, res) => {
	const {_id} = req.account
	const account = await Account.findById(_id, ['following'])
	const followingIds = [_id, ...(account.following.map(following => following.accountId))]
	let posts = await Post.find({postedBy: followingIds}).populate('postedBy')
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
		res.json({success: false, body: {error: 'A post should contain either content or a media file.'}})
	const post = new Post({
		content: content || '',
		media: filename || '',
		likes: 0,
		comments: [],
		accountId: _id,
		postedBy: _id,
		creationDate: currentDateTimestamp(),
	})
	await post.save()
	res.json({success: true, post})
}


module.exports = {
	getPosts,
	createPost
}