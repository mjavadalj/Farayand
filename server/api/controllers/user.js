const mongoose = require("mongoose");
const User = require("../models/user");
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = config.get('app.webServer.jwtSecret');
const { validationResult } = require('express-validator');
const handler = (json, res, code) => {
    res.status(code).json(json);
};

module.exports.addAUser = (req, res) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    })
        .save()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            handler(err, res, 500);
        });
}

module.exports.showAllUsers = (req, res) => {
    User.find({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}

module.exports.signup = (req, res) => {
    if (validationResult(req).errors.length > 0) {
        return res.status(422).json(validationResult(req));
    }
    User.find({
        email: req.body.email
    }).then((user) => {
        if (user.length > 0) {
            return res.status(401).json({
                message: "email already exist"
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        err
                    })
                }
                else {
                    new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                        role: "normal"
                    }).save().then(user => {
                        return res.status(200).json({
                            message: "sign up compelete"
                        })
                    }).catch(err => {
                        return res.status(500).json({
                            err
                        })
                    })
                }
            }).catch(err => {
                return res.status(500).json({
                    err
                })
            })



        }
    })


}


module.exports.signin = (req, res) => {

    User.findOne({
        email: req.body.email
    }).exec().then((user) => {
        if (!user) {
            return res.status(401).json({
                message: "email not exist"
            })
        }
        else {
            console.log(user)
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) {
                    return res.status(500).json({
                        message: "cannot compare"
                    })
                }
                else if (same) {

                    const jwtpayload = {
                        name: user.name,
                        email: user.email,
                        userId: user._id,
                        userName: user.username,
                        role: user.role
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
