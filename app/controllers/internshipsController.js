const { Internship } = require("../schema/models");
const { validateInternshipInput } = require("../utils/validators");
const { getFormattedDate, currentDateTimestamp } = require("../utils/utils");
const { v4 } = require("uuid");

const getInternship = async (req, res) => {
	const {internshipId} = req.params
	try {
		const internship = await Internship.findById(internshipId);
		if(!internship) 
			throw 'Internship does not exist'.
		res.json({success: true, body: {internship}})
	}
	catch(error) {
		res.json({success: false, body: {error: error.message || error}})
	}
}

const getInternships = async (req, res) => {
	const internships = await Internship.find(req.query || {}).populate(
		"companyId"
	);
	res.json({ success: true, body: { internships } });
};

const getCompanyInternships = async (req, res) => {
	const companyId = req.account._id;
	try {
		const internships = await Internship.find({ companyId }).populate({
			path: "applications",
			populate: {
				path: "studentId",
			},
		});
		res.json({ success: true, body: { internships } });
	} catch (error) {
		res.json({ success: false, body: { error: error.message || error } });
	}
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

const applyInternship = async (req, res) => {
	const { internshipId, _id } = req.params;
	const { message } = req.body;
	const {accountType} = req.account;
	try {
		if(accountType !== 'student') 
			throw 'Invalid account type.'
		let internship = await Internship.findById(internshipId);
		if (!internship) throw "Internship does not exist.";
		const applied = internship.applications.find(
			(application) => application.studentId.toString() === _id
		);
		if (applied) throw "Already applied.";
		internship.applications.push({
			_id: v4(),
			message: message || "",
			dateTime: new Date().toString(),
			status: "Applied",
			studentId: _id,
		});
		await internship.save();
		res.json({ success: true, body: { internship } });
	} catch (error) {
		return res.json({
			success: false,
			body: { error: error.message || error },
		});
	}
};

const rejectApplication = async (req, res) => {
	const {_id, internshipId, applicationId} = req.params;
	try {
		let internship = await Internship.findById(internshipId).populate({
			path: "applications",
			populate: {
				path: "studentId",
			},
		});;
		if(!internship) 
			throw "Internship does not exist.";
		if(_id !== internship.companyId.toString()) 
			throw 'Not allowed to reject';
		internship.applications = internship.applications.filter(application => application._id.toString() !== applicationId);
		await internship.save();
		res.json({success: true, body: {internship}});
	}
	catch(error) {
		res.json({success: false, body: {error: error.message || error}})
	}
}

module.exports = {
	getInternship,
	getInternships,
	getCompanyInternships,
	createInternship,
	applyInternship,
	rejectApplication,
};
