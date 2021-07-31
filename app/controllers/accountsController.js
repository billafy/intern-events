const {
	Account
} = require('../schema/models')
const {hashPassword, comparePassword, generateAccessToken} = require('../auth')
const {
	currentDateTimestamp,
	getFormattedDate,
	deleteProfilePicture,
	deleteResume
} = require('../utils')
const {
	accountExists,
	validateCompanyDetails,
	validatePassword,
	validateCollegeDetails,
	validateAccountDetails,
	validateContactNumber,
	validateStudentDetails,
	validateEmail,
} = require('../validators')

/* general methods */

const createAccount = async (res, data) => {
	const hashedPassword = await hashPassword(data.password)

	let account = new Account({
		email: data.email,
		password: hashedPassword,
		accountType: data.accountType,
		contactNumber: data.contactNumber,
		description: data.description || '',
		followers: [],
		following: [],
		creationDate: currentDateTimestamp(),
		profilePicture: 'default.png',
		details: data.details,
	})
	account = await account.save()

	return account
}

/* api views */

const createStudentAccount = async (req, res) => {
	const {
		email,
		password,
		description,
		contactNumber,
		firstName,
		lastName,
		dateOfBirth,
		gender,
		college,
		course,
		yearOfStudying,
	} = req.body
	const details = {firstName, lastName, dateOfBirth, gender, college, course, yearOfStudying, reputationPoints: 0}
	if(
		!validateAccountDetails(res, req.body) || 
		!validateStudentDetails(res, details) || 
		!await accountExists(res, email) || 
		!validateEmail(res, email) || 
		!validatePassword(res, password) || 
		!validateContactNumber(res, contactNumber)  
	) return

	const account = await createAccount(res, {email, password, contactNumber, description, accountType: 'student', 
		details: {...details, dateOfBirth: getFormattedDate(dateOfBirth)}
	})
	if(!account)
			return
	const accessToken = generateAccessToken(account)
	res.cookie('accessToken', accessToken)
	res.status(201).json({success: true, body: {message: 'Account created successfully', account}})
}

const createCollegeAccount = async () => {
	const {
		email,
		password,
		description,
		contactNumber,
		name,
		address,
		university,
	} = req.body
	const details = {name, address, university}
	if(
		!await accountExists(res, email) || 
		!validateEmail(res, email) || 
		!validatePassword(res, password) || 
		!validateContactNumber(res, contactNumber) || 
		!validateAccountDetails(res, data) || 
		!validateCollegeDetails(res, details)
	) return

	const account = await createAccount(res, {email, password, contactNumber, description, accountType: 'college', details})
	if(!account)
		return

	const accessToken = generateAccessToken(account)
	res.cookie('accessToken', accessToken)
	res.status(201).json({success: true, body: {message: 'Account created successfully', account}})
}

const createCompanyAccount = async () => {
	const {
		email,
		password,
		description,
		contactNumber,
		name,
		address,
	} = req.body
	const details = {name, address}
	if(
		!await accountExists(res, email) || 
		!validateEmail(res, email) || 
		!validatePassword(res, password) || 
		!validateContactNumber(res, contactNumber) || 
		!validateAccountDetails(res, data) || 
		!validateCompanyDetails(res, details)
	) return

	const account = await createAccount(res, {email, password, contactNumber, description, accountType: 'company', details})
	if(!account)
		return

	const accessToken = generateAccessToken(account)
	res.cookie('accessToken', accessToken)
	res.status(201).json({success: true, body: {message: 'Account created successfully', account}})
}

const login = async (req, res) => {
	const {email, password} = req.body
	if(!email || !password)
		return res.status(400).json({success: false, body: {error: 'Credentials not provided'}})

	const account = await Account.findOne({email})
	if(!account)
		return res.status(400).json({success: false, body: {error: 'Account does not exist'}})

	if(!await comparePassword(password, account.password))
		return res.status(403).json({success: false, body: {error: 'Incorrect password'}})

	const accessToken = generateAccessToken(account)
	res.cookie('accessToken', accessToken)

	res.json({success: true, body: {message: 'Logged in successfully', account}})
}

const refresh = async (req, res) => {
	const account = await Account.findById(req.account._id, {password: 0})
	res.json({success: true, body: {message: 'Token was verified', account}})
}

const logout = async (req, res) => {
	res.clearCookie('accessToken')
	res.json({success: true, body: {message: 'Logged out successfully'}})
}

const updateEmail = async (req, res) => {
	const {body: {email}, params: {_id}} = req
	if(!await accountExists(res, email) || !validateEmail(res, email))
		return
	const account = await Account.findByIdAndUpdate(_id, {email})
	res.json({success: true, body: {message: 'Email updated', account}})
}

const updatePassword = async (req, res) => {
	const {body: {password}, params: {_id}} = req
	if(password.length < 6)
		return res.json({success: false, body: {error: 'Password too short'}})
	const hashedPassword = await hashPassword(password)
	Account.findByIdAndUpdate(_id, {password: hashedPassword})
	res.json({success: true, body: {message: 'Password updated'}})
}

const updateAccount = async (req, res) => {
	const {accountType, contactNumber, description, details} = req.body
	if(!validateContactNumber(contactNumber))
		return
	if(accountType === 'student' && !validateStudentDetails(details))
		return
	else if(accountType === 'college' && !validateCollegeDetails(details))
		return
	else if(accountType === 'company' && !validateCompanyDetails(details))
		return
	const updatedAccount = await Account.findByIdAndUpdate({contactNumber, description, details})
	res.json({success: true, body: {message: 'Account updated', account: updatedAccount}})
}

const searchAccounts = async (req, res) => {
	const {keyword} = req.params
	if(keyword.length < 3)
		return res.json({success: false, body: {message: 'Keyword too short'}})
	const regexp = {$regex: `${keyword}.*`, $options: 'i'}
	const orCondition = {
		$or: [
			{'details.firstName': regexp},
			{'details.lastName': regexp},
			{'details.name': regexp},
		]
	}
	const accounts = await Account.find(orCondition, {'details.resume': 0, password: 0})
	res.json({success: true, body: {message: `${accounts.length} result(s) found`, results: accounts}})
}

const uploadResume = async (req, res) => {
	const {params: {_id}, file: {filename}} = req
	const account = await Account.findById(_id, ['resume'])
	if(account.resume)
		deleteResume(account.resume)
	account.resume = filename
	account.save()
	res.json({success: true, body: {message: 'Resume uploaded', resume: filename}})
}

const uploadProfilePicture = async (req, res) => {
	const {params: {_id}, file: {filename}} = req
	const account = await Account.findById(_id, ['profilePicture'])
	if(account.profilePicture !== 'default.png' && account.profilePicture)
		deleteProfilePicture(account.profilePicture)
	account.profilePicture = filename
	account.save()
	res.json({success: true, body: {message: 'Profile picture uploaded', profilePicture: filename}})
}

module.exports = {
	createStudentAccount,
	createCollegeAccount,
	createCompanyAccount,
	login,
	refresh,
	logout,
	searchAccounts,
	updateEmail,
	updatePassword,
	updateAccount,
	uploadResume,
	uploadProfilePicture,
}