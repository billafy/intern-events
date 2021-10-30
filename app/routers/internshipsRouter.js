const { Router } = require("express");
const {
	getInternship,
	getInternships,
	createInternship,
	getCompanyInternships,
	applyInternship,
	rejectApplication,
} = require("../controllers/internshipsController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/getInternship/:internshipId", getInternship);
router.get("/getInternships", getInternships);
router.get("/getCompanyInternships/:_id", verifyAccessToken, getCompanyInternships)

router.post("/createInternship/:_id", verifyAccessToken, createInternship);

router.put('/applyInternship/:internshipId/:_id', verifyAccessToken, applyInternship);

router.delete('/rejectApplication/:_id/:internshipId/:applicationId', verifyAccessToken, rejectApplication);

module.exports = router;
