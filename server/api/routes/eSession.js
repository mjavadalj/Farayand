const express = require("express");
const router = express.Router();
const sessionController = require('../controllers/session')

//show all sessions
router.get("/showall",sessionController.showAllSessions);
//show a session || show all questions
router.get("/show",sessionController.showSingleSession);
//add session
router.patch("/add",sessionController.addASession);
//edit a session
router.patch("/edit",sessionController.editASession);
//delete a session
router.patch("/delete",sessionController.deleteSingleSession);
//delete all sessions
router.patch("/deleteall",sessionController.deleteAllSessons);


module.exports = router;
