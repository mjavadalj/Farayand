const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const validation = require("../middlewares/validation");

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
module.exports = router;
