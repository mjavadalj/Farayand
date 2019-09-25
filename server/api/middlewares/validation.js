const {
    check
} = require('express-validator');
const Users = require('../models/user');

// Checking if the attributes provided are valid
exports.signUp = [
    // Email validation
    check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('email is not valid')
        .isLength({
            max: 50
        })
        .withMessage("email can't be more than 50 characters long")
        .custom((email) => {
            return Users.find({
                email: email
            }).then((res) => {
                if (res.length) {
                    return Promise.reject('Email already in use');
                }
            });
        }),

    // username validation
    check('username')
        .isLength({
            min: 2,
            max: 32
        })
        .withMessage('username must be  between 2 and 32 characters long'),
    // name validation
    // check('name')
    //     .isLength({
    //         min: 2,
    //         max: 32
    //     })
    //     .withMessage('name must be  between 2 and 32 characters long'),

    // password validation
    check('password')
        .isLength({
            min: 6
        })
        .withMessage('password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('password must contain a number'),

    // check('password').custom((valuee, {
    //     req
    // }) => {
    //     if (valuee !== req.body.confirmPassword) {
    //         throw new Error('Password confirmation is incorrect');
    //     } else {
    //         return true;
    //     }
    // })
];
