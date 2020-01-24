const express = require("express");
const router = express.Router();
const universityController = require("../controllers/university");
const passport = require("passport");
const auth = require("../middlewares/authintication");

//Add new university
router.post(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  universityController.addUniversity
);

//Show all universites
router.get("/showall", universityController.showAllUniversites);

//Show a university
router.get(
  "/show/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  universityController.showSingleUniversity
);

//Delete all universites
router.delete(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  universityController.deleteAllUniversites
);

//Delete a university
router.post(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  universityController.deleteSingleUniversity
);

//Edit a university
router.patch(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  universityController.editAUniversity
);

module.exports = router;
