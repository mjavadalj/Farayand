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
        .withMessage('ایمیل صحیح نمی باشد')
        .isLength({
            max: 50
        })
        .withMessage("ایمیل نمی تواند از 50 حرف بیشتر باشد")
        .custom((email) => {
            return Users.find({
                email: email
            }).then((res) => {
                if (res.length) {
                    return Promise.reject('ایمیل قبلا استفاده شده است');
                }
            });
        }),

    // nationalcode validation
    check('nationalcode')
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage('کد ملی باید 10 رقم باشد'),
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
        .withMessage('رمز عبور حداقل باید 6 حرف داشه باشد')
        .matches(/\d/)
        .withMessage('رمز عبور باید شامل عدد هم باشد'),

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
