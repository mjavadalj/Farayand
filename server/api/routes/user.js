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
//lesson complete
// router.patch('/lesson/complete',userController.lessonComplete)
//delete all users
router.delete('/deleteall',userController.deleteAllUsers)
//show all teachers
router.get('/teacher/showall',userController.showAllTeachers)
//show all students
router.get('/student/showall',userController.showAllStudents)
//edit user
router.patch('/edit',userController.editUser)
//delete a user
router.post('/delete',userController.deleteAUser)
//show all courses of a teacher
router.post('/course/showall',userController.showAllCoursesOfTeacher)
//show a user
router.post('/show',userController.showAUser)
//show all registered lessons of a user
router.post('/reg/show',userController.showAUserRegLessons)
//delete a reg lesson
router.patch('/reg/delete',userController.deleteAUserRegLesson)
//show all certificates
router.get('/reg/showall',userController.showAllC)
//add uni to teacher
router.patch('/teacher/adduni',userController.addTeacherUni)
//add uni to user
router.patch('/user/adduni',userController.addUserUni)
//remove user university
router.patch('/removeuni',userController.removeUserrUni)
router.patch('/setcertificate',userController.setCertificate)


module.exports = router;
