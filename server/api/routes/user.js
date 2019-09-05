const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

//new user
router.post("/add", userController.addAUser);

router.get('/showall', userController.showAllUsers);

module.exports = router;
