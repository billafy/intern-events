const {Schema, model} = require('mongoose')

const accountSchema = new Schema({
	email: String,
	password: String,
	accountType: String,
	contactNumber: Number,
	description: String,
	followers: [{
		accountId: String,
	}],
	following: [{
		accountId: String,
	}],
	creationDate: String,
	profilePicture: String,
	details: Object,
})

const studentSchema = new Schema({
	firstName: String,
	lastName: String,
	dateOfBirth: String,
	gender: String,
	college: String,
	course: String,
	yearOfStudying: Number,
	reputationPoints: Number,
	accountId: String,
	resume: String,
})

const collegeSchema = new Schema({
	name: String,
	address: String,
	university: String,
	accountId: String
})

const companySchema = new Schema({
	name: String,
	address: String,
	accountId: String,
})

const internshipSchema = new Schema({
	title: String,
	status: String,
	description: String,
	stipend: Number,
	duration: String,
	applicationStart: String,
	applicationEnd: String,
	category: String,
	numberOfPositions: Number,
	accountId: String,
	applicatons: [{
		message: String,
		dateTime: String,
		status: String,
		studentId: String
	}]
})

const eventSchema = new Schema({
	title: String,
	type: String,
	dateTime: String,
	description: String,
	status: String,
	fee: Number,
	prize: String,
	accountId: String,
	participants: [{
		studentId: String,
	}]
})

const postSchema = new Schema({
	caption: String,
	content: String,
	likes: Number,
	accountId: String,
	postedBy: String,
})

const messageSchema = new Schema({
	text: String,
	dateTime: String,
	from: String,
	to: String
})

module.exports = {
	Account: model('Account', accountSchema),
	Internship: model('Internship', internshipSchema),
	Event: model('Event', eventSchema),
	Post: model('Post', postSchema),
	Message: model('Message', messageSchema),
}