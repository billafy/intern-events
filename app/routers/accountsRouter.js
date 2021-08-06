const {Router} = require('express')
const {
	createStudentAccount,
	createCollegeAccount,
	createCompanyAccount,
	refresh,
	login,
	logout,
	searchAccounts,
	updateEmail,
	updatePassword,
	updateAccount,
	uploadResume,
	uploadProfilePicture,
} = require('../controllers/accountsController')
const {verifyAccessToken} = require('../utils/auth')
const {profilePictureUpload, resumeUpload} = require('../utils/staticStorage')

const router = Router()

router.get('/searchAccounts/:keyword', searchAccounts)

router.post('/createStudentAccount', createStudentAccount)
router.post('/createCollegeAccount', createCollegeAccount)
router.post('/createCompanyAccount', createCompanyAccount)
router.post('/login', login)
router.post('/refresh', verifyAccessToken, refresh)
router.post('/uploadResume/:_id',
	verifyAccessToken,
	resumeUpload.single('resume'),
	uploadResume
)
router.post('/uploadProfilePicture/:_id',
	verifyAccessToken,
	profilePictureUpload.single('profilePicture'),
	uploadProfilePicture
)

router.put('/updateEmail/:_id', verifyAccessToken, updateEmail)
router.put('/updatePassword/:_id', verifyAccessToken, updatePassword)
router.put('/updateAccount/:_id', verifyAccessToken, updateAccount)

router.delete('/logout/:_id', verifyAccessToken, logout)

module.exports = router