const { Router } = require("express");
const {
	getInternships,
	createInternship,
	getCompanyInternships,
} = require("../controllers/internshipsController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/getInternships", getInternships);
router.get("/getCompanyInternships/:_id", verifyAccessToken, getCompanyInternships);

router.post("/createInternship", verifyAccessToken, createInternship);
router.post("/createEvent");

router.put("/updateInternship");
router.put("/updateEvent");

module.exports = router;
