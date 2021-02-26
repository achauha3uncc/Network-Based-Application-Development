const User = require('../models/User');
const Connections = require('../models/connections');
const validationResult = require('express-validator').validationResult;

exports.getUserCreate = (req, res, next) => {
    res.render('./users/create', { name: 'Music Meetup Group!' });
}

exports.postUserCreate = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    }
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(result => {
            req.flash('success', 'successfully signed up');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.getUserLogin = (req, res, next) => {
    res.render('./users/login', { name: 'Music Meetup Group!' });
}

exports.postUserLogin = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    }
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(isMatch => {
                        if (isMatch) {
                            req.flash('success', 'successfully logged in');
                            req.session.user = { id: user._id, name: user.firstName };
                            res.redirect('/');
                        } else {
                            req.flash('error', 'Invalid password');
                            //Incorrect password
                            res.redirect('/users/login');
                        }

                    })
            } else {
                req.flash('error', 'Invalid email address');
                //Incorrect email address
                res.redirect('/users/login');
            }
        })
        .catch(err => {
            console.log(err);
            next();
        });

}



exports.getUserProfile = (req, res, next) => {
    User.findById(req.session.user.id)
        .then(user => {
            //   console.log(user);
            if (user) {
                User.findOne({ _id: req.session.user.id }).populate('rsvp.connections')
                    .then(user1 => {
                        if (user1)
                        Connections.find({ user: req.session.user.id }).then(connection => {
                            // console.log(connection);
                            Connections.find({ host: req.session.user.id })
                                .then(created => {
                                    res.render('./users/profile', { saved: user1.rsvp, created: created, name: 'Music Meetup Group!' });
                                })
                            // console.log(connection);
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.getUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}

exports.saveConnectionToUser = (req, res, next) => {
    Connection.findById(req.params.id)
        .then(connection => {
            if (connection)
                User.findById(req.session.user.id)
                    .then(user => {
                        if (user)
                            User.updateOne(user, { $push: { savedConnection: req.params.id } })
                                .then(success => {
                                    if (success)
                                        // res.status(200).render('savedConnection', user.savedConnection);
                                        User.findById(req.session.id, { savedConnections: 1 })
                                            .then(conArray => {
                                                if (conArray)
                                                    res.render('connections/savedConnections', { conList, name: req.session.user.name + ' Welcome to Music Meetup Group!' });
                                                else
                                                    next();
                                            });
                                    else
                                        // res.status(200).render('savedConnection', user.savedConnection);
                                        User.findById(req.session.id, { savedConnections: 1 })
                                            .then(conArray => {
                                                if (conArray)
                                                    res.render('connections/savedConnections', { conList, name: req.session.user.name + ' Welcome to Music Meetup Group!' });
                                                else
                                                    next();
                                            });
                                })
                        else
                            next();
                    })
        }).catch(err => {
            console.log(err);
            next();
        });

}

exports.deleteConnectionFromUser = (req, res, next) => {
    // console.log("I am Called inside delete");
    User.findById(req.session.user.id)
    .then(user => {   
            if (user) 
                User.updateOne(user, { $pull: { rsvp: { connections: req.params.id } } })
                    .then(conArray => {
                        if (conArray){
                        req.flash('success', 'Connection Deleted');
                            res.redirect('/users/profile');
                        }
                        else
                            next();
                    });
            else {
                req.flash('error', 'User is not authorized to delete the connection');
                res.redirect('/connections');
            }
        }).catch(err => {
            console.log(err);
            next();
        });

}

