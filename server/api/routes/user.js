const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const validation = require("../middlewares/validation");
const auth = require("../middlewares/authintication");
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
router.patch(
  "/lesson/register",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.lessonRegister
);
//session register
router.patch(
  "/session/register",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.sessionRegister
);
//session complete
//TODO: check this
// router.patch("/session/complete", userController.sessionComplete);
//lesson complete
// router.patch('/lesson/complete',userController.lessonComplete)
//delete all users
router.delete(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.deleteAllUsers
);
//show all teachers
router.get(
  "/teacher/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.showAllTeachers
);
//show all students
router.get(
  "/student/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.showAllStudents
);
//edit user
//TODO: important
// router.patch("/edit", userController.editUser);
//delete a user
router.post(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.deleteAUser
);
//show all courses of a teacher
router.post(
  "/course/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.showAllCoursesOfTeacher
);
//show a user
router.post(
  "/show",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.showAUser
);
//show all registered lessons of a user
router.post(
  "/reg/show",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.showAUserRegLessons
);
//delete a reg lesson
router.patch(
  "/reg/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.deleteAUserRegLesson
);
//show all certificates
// router.get("/reg/showall", userController.showAllC);
router.post(
  "/reg/show/certificates",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.showUserCertificates
);
//add uni to teacher
router.patch(
  "/teacher/adduni",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.addTeacherUni
);
//add uni to user
router.patch(
  "/user/adduni",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  userController.addUserUni
);
//remove user university
router.patch(
  "/removeuni",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isTeacher,
  userController.removeUserrUni
);
router.patch(
  "/setcertificate",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.setCertificate
);
router.post(
  "/student/showTeachers",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.showUniTeachers
);

router.post(
  "/teacher/checkCertificate",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isTeacher,
  userController.teacherCheckCertificate
);
router.patch(
  "/changeUNI",
  passport.authenticate("jwt", {
    session: false
  }),
  userController.changeUNI
);
router.post(
  "/forgetpassword",
  userController.resetPassword
);



module.exports = router;
