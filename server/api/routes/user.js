const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');

//new user
router.post("/add", userController.addAUser);

router.get('/showall', userController.showAllUsers);

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);


router.get('/testJWT',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        return res.status(200).json({
            email: req.user.email
        })
    }
);

module.exports = router;
