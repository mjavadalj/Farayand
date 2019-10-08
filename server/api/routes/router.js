const router = require('express').Router();
const university = require('./university')
const user = require('./user')
const certificate = require('./certificate')
const eCourse=require('./eCourse')
const eLesson=require('./eLesson')
const eSession=require('./eSession')
const eQuestion=require('./eQuestion')
const geo=require('./geo')

router.use('/course', eCourse)
router.use('/lesson', eLesson)
router.use('/session', eSession)
router.use('/question', eQuestion)
router.use('/university', university)
router.use('/user', user)
router.use('/certificate', certificate)
router.use('/geo', geo)

module.exports = router;
