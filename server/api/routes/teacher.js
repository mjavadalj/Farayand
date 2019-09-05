const express = require("express");
const router = express.Router();
const teacherController = require('../controllers/teacher');

//new Teacher
router.post("/add", teacherController.addATeacher);

router.get('/showall', teacherController.showAllTeacher);

module.exports = router;
