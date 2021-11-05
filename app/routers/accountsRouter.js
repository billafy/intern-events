const { Router } = require("express");
const {
	searchAccounts,
	updateEmail,
	updatePassword,
	updateAccount,
	uploadResume,
	uploadProfilePicture,
	getAccount,
} = require("../controllers/accountsController");
const { verifyAccessToken } = require("../utils/auth");
const { storageUpload } = require("../utils/mediaStorage");

const router = Router();

router.get("/getAccount/:_id", getAccount);
router.get("/searchAccounts/:keyword", searchAccounts);

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

module.exports = router;
