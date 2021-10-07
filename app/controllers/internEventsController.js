const {
	Internship,
	Event
} = require('../schema/models');

const getInternships = async (req, res) => {
	const internships = await Internship.find(req.query)
	res.json({success: true, body: {internships}})
}

const createInternship = (req, res) => {
	const {
		title,
		description,
		stipend,
		duration,
		applicationStart,
		applicationEnd,
		category,
		numberOfPositions,
	} = req.body

	const internship = new Internship({
		title,
		description,
		stipend,
		duration,
		applicationStart,
		applicationEnd,
		category,
		numberOfPositions,
		applications: [],
	}).save()
	res.json({success: true, body: {internship}})
}

const updateInternship = (req, res) => {
	res.json({success: true, body: 'oye'})
}

const applyInternship = (req, res) => {
	res.json({success: true, body: 'oye'})
}

const getEvents = (req, res) => {
	res.json({success: true, body: 'oye'})
}

const createEvent = (req, res) => {
	res.json({success: true, body: 'oye'})
}

const updateEvent = (req, res) => {
	res.json({success: true, body: 'oye'})
}

const applyEvent = (req, res) => {
	res.json({success: true, body: 'oye'})
}

module.exports = {
	getInternships,
	createInternship,
	updateInternship,
	getEvents,
	createEvent,
	updateEvent,
}