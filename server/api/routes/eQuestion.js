const express = require("express");
const router = express.Router();
const questionController = require('../controllers/question');
//add a question
router.patch("/add",questionController.add);
//delete a question
router.patch("/delete",questionController.deleteAQuestion);
//delete all questions
router.patch("/deleteall", questionController.deleteAllQuestions);
//edit a question
router.patch("/edit",questionController.editAQuestion);
module.exports = router;
