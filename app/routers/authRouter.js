const { Router } = require("express");
const {
	createStudentAccount,
	createCollegeAccount,
	createCompanyAccount,
	refresh,
	login,
	logout,
} = require("../controllers/authController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.post("/createStudentAccount", createStudentAccount);
router.post("/createCollegeAccount", createCollegeAccount);
router.post("/createCompanyAccount", createCompanyAccount);
router.post("/login", login);
router.post("/refresh", verifyAccessToken, refresh);

router.delete("/logout/:_id", verifyAccessToken, logout);

module.exports = router;
