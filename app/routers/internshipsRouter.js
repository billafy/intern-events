const { Router } = require("express");
const {getInternships, createInternship} = require("../controllers/internshipsController");
const {verifyAccessToken} = require('../utils/auth')

const router = Router();

router.get("/getInternships", getInternships);

router.post("/createInternship", verifyAccessToken, createInternship);
router.post("/createEvent");

router.put("/updateInternship");
router.put("/updateEvent");

module.exports = router;
