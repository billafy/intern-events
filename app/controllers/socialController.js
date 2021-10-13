const {Post} = require('../schema/models')
const {currentDateTimestamp} = require('../utils/utils')

const getPosts = async (req, res) => {
	console.log(req.body)
	res.json({success: true})
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