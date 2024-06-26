
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json(
                        {error : err});
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                        });
                        user
                          .save()
                          .then(result => {
                             res.status(201).json({
                                message: 'User Created',
                                _id: result._id
                             });
                          })
                          .catch(err => {
                             console.log(err);
                             res.status(500).json({
                                error: err
                             });
                          })
                }
            });
        }
    })
}

exports.user_login =  (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message: 'Auth failed!'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful!',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
      });
}

exports.delete_user =  (res, req, next) => {
    const id = req.params.userId;
    User.deleteOne({_id: id})
      .exec()
      .then(result => {
        res.status(200).json({
            message: "User deleted!"
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
      });
}
