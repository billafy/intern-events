const { Internship } = require("../schema/models");
const { validateInternshipInput } = require("../utils/validators");
const { getFormattedDate, currentDateTimestamp } = require("../utils/utils");

const getInternships = async (req, res) => {
	const internships = await Internship.find(req.query || {}).populate('companyId');
	res.json({ success: true, body: { internships } });
};

const getCompanyInternships = async (req, res) => {
	const companyId = req.account._id;
	const internships = await Internship.find({ companyId }).populate({
		path: "applications",
		populate: {
			path: "studentId",
		},
	});
	res.json({ success: true, body: { internships } });
};

const createInternship = async (req, res) => {
	const input = req.body.internshipInput;
	if (req.account.accountType !== "company")
		return res.json({
			success: false,
			body: { error: "Unauthorized account type." },
		});

	if (!validateInternshipInput(res, input)) return;

	const internship = new Internship({
		title: input.title,
		description: input.description,
		stipend: input.stipend,
		duration: input.duration,
		applicationStart: getFormattedDate(new Date()),
		applicationEnd: getFormattedDate(input.applicationEnd),
		category: input.category,
		numberOfPositions: input.numberOfPositions,
		applications: [],
		companyId: req.account._id,
	});
	await internship.save();
	res.json({ success: true, body: { internship } });
};

const updateInternship = (req, res) => {
	res.json({ success: true, body: "oye" });
};

const applyInternship = (req, res) => {
	res.json({ success: true, body: "oye" });
};

const getEvents = (req, res) => {
	res.json({ success: true, body: "oye" });
};

const createEvent = (req, res) => {
	res.json({ success: true, body: "oye" });
};

const updateEvent = (req, res) => {
	res.json({ success: true, body: "oye" });
};

const applyEvent = (req, res) => {
	res.json({ success: true, body: "oye" });
};

module.exports = {
	getInternships,
	getCompanyInternships,
	createInternship,
	updateInternship,
	getEvents,
	createEvent,
	updateEvent,
};