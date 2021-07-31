const multer = require('multer')

const profilePictureStorage = multer.diskStorage({
	destination: 'media/profilePictures/',
	filename: (req, file, cb) => {
		const type = file.mimetype.split('/')
		if(type[0] === 'image')
			cb(null, `${Date.now()}.${type[1]}`)
	}
})
const profilePictureUpload = multer({storage: profilePictureStorage})

const resumeStorage = multer.diskStorage({
	destination: 'media/resumes/',
	filename: (req, file, cb) => {
		const type = file.mimetype.split('/')
		if(type[1] === 'pdf')
			cb(null, `${Date.now()}.${type[1]}`)
	}
})
const resumeUpload = multer({storage: resumeStorage})

module.exports ={
	profilePictureUpload,
	resumeUpload
}
