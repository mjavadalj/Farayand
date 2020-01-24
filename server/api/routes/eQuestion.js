const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question");
const passport = require("passport");
const auth = require("../middlewares/authintication");
//add a question
router.patch(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  questionController.add
);
//delete a question
router.patch(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  questionController.deleteAQuestion
);
//delete all questions
router.patch(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  questionController.deleteAllQuestions
);
//edit a question
router.patch(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  questionController.editAQuestion
);
module.exports = router;
