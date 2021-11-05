const { Account } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");
const { currentDateTimestamp } = require("../utils/utils");
const {
	accountExists,
	validateCompanyDetails,
	validatePassword,
	validateCollegeDetails,
	validateAccountDetails,
	validateContactNumber,
	validateStudentDetails,
	validateEmail,
} = require("../utils/validators");

const createAccount = async (res, data) => {
	const hashedPassword = await hashPassword(data.password);

	let account = new Account({
		email: data.email,
		password: hashedPassword,
		accountType: data.accountType,
		contactNumber: data.contactNumber,
		description: data.description || "",
		followers: [],
		following: [],
		creationDate: currentDateTimestamp(),
		profilePicture: "default.png",
		details: data.details,
	});
	account = await account.save();

	return account;
};

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
	} = req.body;
	const details = {
		firstName,
		lastName,
		dateOfBirth,
		gender,
		college,
		course,
		yearOfStudying,
		reputationPoints: 0,
		projects: [],
		skills: [],
		resume: "",
	};
	if (
		!validateAccountDetails(res, req.body) ||
		!validateStudentDetails(res, details) ||
		!(await accountExists(res, email)) ||
		!validateEmail(res, email) ||
		!validatePassword(res, password) ||
		!validateContactNumber(res, contactNumber)
	)
		return;

	const account = await createAccount(res, {
		email,
		password,
		contactNumber,
		description,
		accountType: "student",
		details: {
			...details,
			dateOfBirth,
			projects: [],
			skills: [],
		},
	});
	if (!account) return;
	const accessToken = generateAccessToken(account);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });
	res.status(201).json({
		success: true,
		body: { message: "Account created successfully", account },
	});
};

const createCollegeAccount = async (req, res) => {
	const {
		email,
		password,
		description,
		contactNumber,
		name,
		address,
		university,
	} = req.body;
	const details = { name, address, university };
	if (
		!(await accountExists(res, email)) ||
		!validateEmail(res, email) ||
		!validatePassword(res, password) ||
		!validateContactNumber(res, contactNumber) ||
		!validateAccountDetails(res, req.body) ||
		!validateCollegeDetails(res, details)
	)
		return;

	const account = await createAccount(res, {
		email,
		password,
		contactNumber,
		description,
		accountType: "college",
		details,
	});
	if (!account) return;

	const accessToken = generateAccessToken(account);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });
	res.status(201).json({
		success: true,
		body: { message: "Account created successfully", account },
	});
};

const createCompanyAccount = async (req, res) => {
	const { email, password, description, contactNumber, name, address } =
		req.body;
	const details = { name, address };
	if (
		!(await accountExists(res, email)) ||
		!validateEmail(res, email) ||
		!validatePassword(res, password) ||
		!validateContactNumber(res, contactNumber) ||
		!validateAccountDetails(res, req.body) ||
		!validateCompanyDetails(res, details)
	)
		return;

	const account = await createAccount(res, {
		email,
		password,
		contactNumber,
		description,
		accountType: "company",
		details,
	});
	if (!account) return;

	const accessToken = generateAccessToken(account);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });
	res.status(201).json({
		success: true,
		body: { message: "Account created successfully", account },
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).json({
			success: false,
			body: { error: "Credentials not provided" },
		});

	const account = await Account.findOne({ email });
	if (!account)
		return res.status(400).json({
			success: false,
			body: { error: "Account does not exist" },
		});

	if (!(await comparePassword(password, account.password)))
		return res
			.status(403)
			.json({ success: false, body: { error: "Incorrect password" } });

	const accessToken = generateAccessToken(account);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });

	res.json({
		success: true,
		body: { message: "Logged in successfully", account },
	});
};

const refresh = async (req, res) => {
	const account = await Account.findById(req.account._id);
	res.json({
		success: true,
		body: { message: "Token was verified", account },
	});
};

const logout = async (req, res) => {
	res.clearCookie("accessToken");
	res.json({ success: true, body: { message: "Logged out successfully" } });
};

module.exports = {
	createStudentAccount,
	createCollegeAccount,
	createCompanyAccount,
	login,
	refresh,
	logout,
};