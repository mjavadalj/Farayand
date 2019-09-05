const express = require("express");
const router = express.Router();
const quizController = require('../controllers/quiz');

//Add new quiz
router.post('/add', quizController.add)


//Show all quizzes
router.get('/showall', quizController.showAllQuizzes)

//Show a quiz
router.get('/show/:id', quizController.showSingleQuiz)

//Delete all quizzes
router.delete('/deleteall', quizController.deleteAllQuizzes)

//Delete a quiz
router.delete('/delete/:id', quizController.deleteSingleQuize)

//Add question to a quiz
router.patch('/:id/questions/add', quizController.addQuestionsToAQuiz)

//Delete a question from quiz
router.patch('/:id/questions/delete/:questionId', quizController.deleteAQuestionOfAQuiz)

//TODO: Delete all questions from quiz
//Edit a question
router.patch('/:id/questions/edit/:questionId', quizController.editAQuestion)

//Edit a quiz
router.patch('/edit/:id', quizController.editAQuiz);

module.exports = router;