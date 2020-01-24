const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session");
const multer = require("multer");
const passport = require("passport");
const auth = require("../middlewares/authintication");

//show all sessions
router.post(
  "/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  sessionController.showAllSessions
);

//show all questions
router.post(
  "/showallquestions",
  passport.authenticate("jwt", {
    session: false
  }),
  sessionController.showAllQuestions
);
//show randonm questions
router.post(
  "/showrandonmquestions",
  passport.authenticate("jwt", {
    session: false
  }),
  sessionController.showRandomQuestions
);
//add session
router.patch(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  sessionController.addASession
);
//edit a session
router.patch(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  sessionController.editASession
);
//delete a session
router.patch(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  sessionController.deleteSingleSession
);
//delete all sessions
router.patch(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  sessionController.deleteAllSessons
);
router.post(
  "/checkquiz",
  passport.authenticate("jwt", {
    session: false
  }),
  sessionController.checkQuiz
);

module.exports = router;
