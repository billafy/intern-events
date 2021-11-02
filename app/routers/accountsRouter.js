const { Router } = require("express");
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
	getAccountIds,
	getAccount,
} = require("../controllers/accountsController");
const { verifyAccessToken } = require("../utils/auth");
const { storageUpload } = require("../utils/mediaStorage");

const router = Router();

router.get("/getAccount/:_id", getAccount);
router.get("/getAccountIds", getAccountIds);
router.get("/searchAccounts/:keyword", searchAccounts);

router.post("/createStudentAccount", createStudentAccount);
router.post("/createCollegeAccount", createCollegeAccount);
router.post("/createCompanyAccount", createCompanyAccount);
router.post("/login", login);
router.post("/refresh", verifyAccessToken, refresh);

router.put(
	"/uploadResume/:_id",
	verifyAccessToken,
	storageUpload.single("resume"),
	uploadResume
);
router.put(
	"/uploadProfilePicture/:_id",
	verifyAccessToken,
	storageUpload.single("profilePicture"),
	uploadProfilePicture
);
router.put("/updateEmail/:_id", verifyAccessToken, updateEmail);
router.put("/updatePassword/:_id", verifyAccessToken, updatePassword);
router.put("/updateAccount/:_id", verifyAccessToken, updateAccount);

router.delete("/logout/:_id", verifyAccessToken, logout);

module.exports = router;
