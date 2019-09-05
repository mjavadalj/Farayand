const router = require('express').Router();
const session = require('./session')
const lesson = require('./lesson')
const course = require('./course')
const university = require('./university')
const teacher = require('./teacher')
const quiz = require('./quiz');
// const user = require('./user');

router.use('/quiz', quiz)
router.use('/session', session)
router.use('/lesson', lesson)
router.use('/course', course)
router.use('/university', university)
router.use('/teacher', teacher)

// router.use('/user', user)

module.exports = router;