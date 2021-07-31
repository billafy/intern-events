const {Account} = require('./schema/models')
const validator = require('email-validator')
const {getFormattedDate} = require('./utils')

const accountExists = async (res, email) => {
	const existingAccount = await Account.findOne({email})
	if(existingAccount) {
		res.json({success: false, error: 'Email already exists'})
		return false
	}
	return true
}

const domains = ['com', 'in', 'org', 'ru', 'fr', 'eu', 'br', 'net', 'uk']
const providers = ['gmail', 'yahoo', 'hotmail', 'ymail', 'reddifmail']
const validateEmail = (res, email) => {
	if(!validator.validate(email)) {
		res.json({success: false, body: {error: 'Invalid email address'}})
		return false
	}
	const emailServer = email.split('@')[1]
	const provider = emailServer.split('.')[0]
	const domain = emailServer.split('.')[1]
	if(!providers.includes(provider) || !domains.includes(domain)) {
		res.json({success: false, body: {error: 'Invalid email address'}})
		return false
	}
	return true
}

const validatePassword = (res, password) => {
	if(password.length < 6) {
		res.json({success: false, body: {error: 'Password should contain atleast 6 characters'}})
		return false
	}
	return true
}

const validateContactNumber = (res, contactNumber) => {
	if(isNaN(String(contactNumber)) || String(contactNumber).length !== 10) {
		res.json({success: false, body: {error: 'Invalid contact number'}})
		return false
	}
	return true
}

const validateAccountDetails = (res, data) => {
	const {email, password, contactNumber} = data

	if(!email || !password || !contactNumber) {
		res.json({success: false, body: {error: 'Incomplete information provided'}})
		return false
	}
	return true
}

const genders = ['Male', 'Female']
const validateStudentDetails = (res, details) => {
	const {firstName, lastName, dateOfBirth, gender, college, course, yearOfStudying} = details

	if(!firstName || !lastName || !dateOfBirth || !gender || !college || !course || !yearOfStudying) {
		res.json({success: false, body: {error: 'Incomplete information provided'}})
		return false
	}
	if(!genders.includes(gender)) {
		res.json({success: false, body: {error: 'Invalid gender'}})
		return false
	}
	if(!getFormattedDate(dateOfBirth)) {
		res.json({success: false, body: {error: 'Invalid date of birth'}})
		return false
	}
	return true
}

const validateCollegeDetails = (res, details) => {
	const {name, address, university} = details

	if(!name || !address || !university) {
		res.json({success: false, body: {error: 'Incomplete information provided'}})
		return false
	}
	return true
}

const validateCompanyDetails = (res, details) => {
	const {name, address} = details

	if(!name || !address) {
		res.json({success: false, body: {error: 'Incomplete information provided'}})
		return false
	}
	return true
}


module.exports = {
	accountExists,
	validateCompanyDetails,
	validatePassword,
	validateCollegeDetails,
	validateAccountDetails,
	validateContactNumber,
	validateStudentDetails,
	validateEmail,
}