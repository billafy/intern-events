const { Account } = require("../schema/models");
const { hashPassword } = require("../utils/auth");
const { idify } = require("../utils/utils");
const {
	accountExists,
	validateCompanyDetails,
	validatePassword,
	validateCollegeDetails,
	validateContactNumber,
	validateStudentDetails,
	validateEmail,
} = require("../utils/validators");
const { imageKit, deleteMedia } = require("../utils/mediaStorage");
const { readFileSync } = require("fs");

const getAccount = async (req, res) => {
	const { _id } = req.params;
	const account = await Account.findById(_id);
	if (!account)
		return res.json({
			success: false,
			body: { error: "Account does not exists." },
		});
	res.json({ success: true, body: { account } });
};

const updateEmail = async (req, res) => {
	const {
		body: { email },
		params: { _id },
	} = req;
	if (!(await accountExists(res, email)) || !validateEmail(res, email))
		return;
	const account = await Account.findByIdAndUpdate(
		_id,
		{ email },
		{ new: true }
	);
	res.json({ success: true, body: { message: "Email updated", account } });
};

const updatePassword = async (req, res) => {
	const {
		body: { password },
		params: { _id },
	} = req;
	if (!password)
		return res.json({ success: false, body: { error: "No password" } });
	if (!validatePassword(res, password)) return;
	const hashedPassword = await hashPassword(password);
	Account.findByIdAndUpdate(
		_id,
		{ password: hashedPassword },
		{ new: true }
	).exec();
	res.json({ success: true, body: { message: "Password updated" } });
};

const updateAccount = async (req, res) => {
	const { accountType } = req.account;
	const { _id } = req.params;
	if (!req.body.account)
		return res.json({
			success: false,
			body: { error: "Incomplete information provided" },
		});
	let { contactNumber, description, details } = req.body.account;
	if (!contactNumber || !details)
		return res.json({
			success: false,
			body: { error: "Incomplete information provided" },
		});
	if (!validateContactNumber(res, contactNumber)) return;
	if (accountType === "student" && !validateStudentDetails(res, details))
		return;
	else if (accountType === "college" && !validateCollegeDetails(res, details))
		return;
	else if (accountType === "company" && !validateCompanyDetails(res, details))
		return;
	if (accountType === "student")
		details = {
			...details,
			projects: idify(details.projects),
			skills: idify(details.skills),
		};
	const updatedAccount = await Account.findByIdAndUpdate(
		_id,
		{ contactNumber, description, details },
		{ new: true }
	);
	res.json({
		success: true,
		body: { message: "Account updated", account: updatedAccount },
	});
};

const searchAccounts = async (req, res) => {
	const { keyword } = req.params;
	const regexp = { $regex: `${keyword}.*`, $options: "i" };
	const orCondition = {
		$or: [
			{ "details.firstName": regexp },
			{ "details.lastName": regexp },
			{ "details.name": regexp },
		],
	};
	const accounts = await Account.find(orCondition, [
		"details",
		"profilePicture",
	]);
	res.json({
		success: true,
		body: {
			message: `${accounts.length} result(s) found`,
			results: accounts,
		},
	});
};

const uploadResume = async (req, res) => {
	const {
		params: { _id },
		file,
	} = req;
	const type = file.mimetype.split("/")[1];
	const fileName = file.filename;
	if (type !== "pdf")
		return res.json({
			success: false,
			body: { error: "Invalid file type." },
		});
	const account = await Account.findById(_id);
	const image = readFileSync("public/" + fileName);
	imageKit.upload(
		{ file: image, fileName: fileName.split(".")[0] },
		async (err, result) => {
			if (err)
				return res.json({
					success: false,
					body: { error: "Failed to upload." },
				});
			const resume = result.name;
			account.details = { ...account.details, resume };
			await account.save();
			deleteMedia(fileName);
			res.json({
				success: true,
				body: { message: "Profile picture uploaded", account },
			});
		}
	);
};

const uploadProfilePicture = async (req, res) => {
	const {
		params: { _id },
		file,
	} = req;
	const type = file.mimetype.split("/")[0];
	const fileName = file.filename;
	if (type !== "image")
		return res.json({
			success: false,
			body: { error: "Invalid file type." },
		});
	const account = await Account.findById(_id);
	const image = readFileSync("public/" + fileName);
	imageKit.upload(
		{ file: image, fileName: fileName.split(".")[0] },
		async (err, result) => {
			if (err)
				return res.json({
					success: false,
					body: { error: "Failed to upload." },
				});
			const profilePicture = result.name;
			account.profilePicture = profilePicture;
			await account.save();
			deleteMedia(fileName);
			res.json({
				success: true,
				body: { message: "Profile picture uploaded", account },
			});
		}
	);
};

module.exports = {
	searchAccounts,
	updateEmail,
	updatePassword,
	updateAccount,
	uploadResume,
	uploadProfilePicture,
	getAccount,
};