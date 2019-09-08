const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const validation = require("../middlewares/validation");
const delete_ref = require("../middlewares/delete_ref");

//new user
router.post("/add", userController.addAUser);

router.get("/showall", userController.showAllUsers);
router.post("/signup", validation.signUp, userController.signup);
router.post("/signin", userController.signin);

router.get(
  "/testJWT",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    return res.status(200).json({
      email: req.user.email
    });
  }
);

//lesson register
router.patch('/lesson/register',userController.lessonRegister)
//session register
router.patch('/session/register',userController.sessionRegister)
//session complete
router.patch('/session/complete',userController.sessionComplete)
//delete all users
router.delete('/deleteall',userController.deleteAllUsers)
//show all teachers
router.get('/teacher/showall',userController.showAllTeachers)
//show all students
router.get('/student/showall',userController.showAllStudents)
//edit user
router.patch('/edit',userController.editUser)
//delete a user
router.post('/delete',delete_ref.course,userController.deleteAUser)
//show all courses of a teacher
router.post('/course/showall',userController.showAllCoursesOfTeacher)
//show a user
router.post('/show',userController.showAUser)

module.exports = router;
