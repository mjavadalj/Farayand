const express = require("express");
const router = express.Router();
const delete_ref = require("../middlewares/delete_ref");
const sessionController = require('../controllers/session')

//add new session
router.post("/add", sessionController.addASession);

//Show all sessions
router.get("/showall", sessionController.showAllSessions);

//Show a session
router.get("/show/:id", sessionController.showSingleSession);

//Delete all sessions without deleting quizzes
router.delete("/deleteall", sessionController.deleteAllSessons);

//Delete a session without deleting quiz
router.delete("/delete/:id", sessionController.deleteSingleSession);

//Delete a session and quiz
router.delete("/delete/:id/withquiz", delete_ref.quiz, sessionController.deleteASessionWithQuiz);

//edit a session
router.patch("/edit/:id", sessionController.editASession);

//add and set quiz to a session
router.patch("/:id/quiz/add", sessionController.setAQuizToASession);

//Delete quiz of session
//TODO: better option??
router.patch("/:id/quiz/delete", sessionController.deleteQuizeOfASession);

//TODO: files

module.exports = router;
