const express = require("express");
const router = express.Router();
const confirmedController = require("../controllers/confirmed");
const passport = require("passport");
const auth = require("../middlewares/authintication");
//show all
router.get(
  "/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  confirmedController.showAll
);
router.post(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  confirmedController.delete
);
router.post(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  confirmedController.add
);
module.exports = router;
