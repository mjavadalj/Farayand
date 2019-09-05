
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacher')

const mongoose = require("mongoose");
const jwtSecret = config.get('app.webServer.jwtSecret');

module.exports.signup = (req, res) => {

    User.find({
        email: req.body.email
    }).then((user) => {
        if (user) {
            return res.status(401).json({
                message: "email already exist"
            })
        }
        else {
            new User({
                _id: mongoose.Types.ObjectId,
                email: req.body.email
            }).save().then(user => {

            })
        }
    })


}


module.exports.signin = (req, res) => {

    User.find({
        email: req.body.email
    }).exec().then((user) => {
        if (!user) {
            return res.status(401).json({
                message: "email not exist"
            })
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) {
                    return res.status(500).json({
                        message: "cannot compare"
                    })
                }
                else if (same) {

                    const jwtpayload = {
                        name: firstuser.name,
                        email: firstuser.email,
                        userId: firstuser.userId,
                        userName: firstuser.userName
                    };
                    jwt.sign(
                        jwtpayload,
                        jwtSecret, {
                            expiresIn: '10h'
                        },
                        (err, encoded) => {
                            if (err) {
                                throw new Error('error in jwt');
                            } else {
                                return res.status(200).json({
                                    done: true,
                                    secret: 'bearer ' + encoded
                                });
                            }
                        }
                    );


                }
            })
        }
    })


}
