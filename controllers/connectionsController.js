const Connections = require('../models/connections');
const validationResult = require('express-validator').validationResult;
const User = require('../models/User');

exports.getAllConnections = (req, res, next) => {
    Connections.find()
        .then(result => {
            res.render('./connections/connections', { data: result, name: 'Connections' });
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.getConnectionsDetail = (req, res, next) => {
    Connections.findById(req.params.id)
        .populate('host', 'firstName')
        .then(result => {
            if (result) {

                res.render('./connections/connection', { data: result, name: result.host });

            } else
                next();
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.getConnectionCreate = (req, res) => {
    res.render('./connections/createConnection', { name: 'Music Meetup Group!' });
}

exports.getConnectionUpdate = (req, res, next) => {


    Connections.findById(req.params.id)
        .then(result => {
            if (result && result.host == req.session.user.id)
                Connections.findById(req.params.id)
                    .populate('host')
                    .then(connection => {
                        if (connection)
                            res.render('./connections/updateConnection', { data: connection, name: 'Update Connections!' });
                        else {
                            req.flash('error', 'This connection cannot be updated');
                            res.redirect('/connections');
                        }
                    })
            else {
                req.flash('error', 'This connection cannot be updated');
                res.redirect('/connections');
            }
        })
        .catch(err => {
            console.log(err);
            next();
        });
}

exports.createConnections = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    }
    else {
        let connections = new Connections({
            title: req.body.title,
            category: req.body.category,
            details: req.body.details,
            date: req.body.date,
            startingTime: req.body.startingTime,
            endingTime: req.body.endingTime,
            location: req.body.location,
            host: req.session.user.id,
            imageURL: req.body.imageURL,

        });

        connections.save()
            .then(result => {
                req.flash('success', 'Connection created successfully');
                res.redirect('/connections');
            })
            .catch(err => {
                console.log(err);
                next();
            });
    }
}

exports.updateConnections = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    } else {
        let connectionsParams = {
            title: req.body.title,
            category: req.body.category,
            details: req.body.details,
            date: req.body.date,
            startingTime: req.body.startingTime,
            endingTime: req.body.endingTime,
            location: req.body.location,
            host: req.session.user.id,
            imageURL: req.body.imageURL,
            // user: req.session.user.id
        };

        Connections.findById(req.params.id)
            .then(result => {
                if (result && result.host == req.session.user.id)
                    return Connections.findByIdAndUpdate(req.params.id, { $set: connectionsParams });
                else {
                    req.flash('error', 'This connection cannot be updated as you are not the owner');
                    res.redirect('/connections');
                }
                res.redirect('/connections');
            })
            .then(result => {
                req.flash('success', ' Connection updated successfully');
                res.redirect('/connections/' + req.params.id);
            })
            .catch(err => {
                console.log(err);
                next();
            });
    }
}

exports.deleteConnections = (req, res, next) => {

    // Connections.findById(req.params.id)
    //     .then(result => {

    //         if (result && result.host == req.session.user.id)
    //             Connections.findByIdAndDelete(req.params.id)
    //                 .then(run => {
    //                     console.log(run
    //                         User.updateMany({},
    //                             { $pull: { rsvp: { run: req.params.id}}},
    //                             {multi: true}

    //                             ).then(result => {
    //                                 console.log(result);
    //                                 res.redirect('/connections');
    //                             }))
    //                 });
    //             req.flash('error', 'Successfully deleted the connection');
    //     });
    //         else {
    //             req.flash('error', 'This connection cannot be deleted by you as you are not the owner');
    //             res.redirect('/connections');
    //         }
    //     })
    //     .then(result => {
    //         req.flash('success', ' Connection deleted successfully');
    //         res.redirect('/connections/');
    //     })

    // console.log("I am called");
    Connections.findById(req.params.id)
        .then(result => {
            if (result && result.host._id == req.session.user.id) {
                Connections.findByIdAndDelete(req.params.id)
                    .then(con => {
                        console.log(con);
                        User.updateMany({},
                            { $pull: { rsvp: { connections: req.params.id } } },
                            { multi: true }
                        ).then(result => {
                            //   console.log(result);
                            res.redirect('/connections');
                        })
                        req.flash('error', 'Successfully deleted the connection');
                    });
            } else {
                req.flash('error', 'User is not authorized to delete the connection');
                res.redirect('/connections');
            }
        })
        .catch(err => {

            console.log(err);
            next();
        });

}

exports.getSavedConnections = (req, res, next) => {
    if (req.session.user != null) {
        User.find({ user: req.session.user.id }).populate(rsvp.user)
            .then((user) => {
                res.render("./users/profile", { user });
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/login');
            })
    } else {
        res.redirect("/users/login");
    }
};

exports.saveEnrolledStatus = (req, res, next) => {

    var status = "Maybe";

    let flag = false;

    if (req.body.yes) {
        status = "Yes";
        Connections.findById(req.params.id)
            .then(res => {
                Connections.updateOne({ _id: req.params.id }, { $inc: { numberOfEnrollments: 1 } })
                    .then(result => {
                    })
            })
    }
    else if (req.body.no) {
        status = "No";
        Connections.findById(req.params.id)
            .then(result => {
                numberOfEnrollments = result.numberOfEnrollments;
                if (numberOfEnrollments > 0) {
                    Connections.updateOne({ _id: req.params.id }, { $inc: { "numberOfEnrollments": -1 } })
                        .then(result => {
                            console.log(result)
                        });
                }
            })
            .catch(err => {
                console.log(err);
                next();
            })
    }
    User.findById(req.session.user.id)
        .then(users => {
            // users.rsvp.forEach(connection => {
                val = users.rsvp.find(connection =>  connection.connections==req.params.id)
                // console.log("1 " + connection.connections);
                // console.log("2 " + req.params.id);
                // if (connection.connections === req.params.id) {
                    if(val !== undefined){

                    // console.log("Old Val");
                    User.updateOne({ _id: req.session.user.id, "rsvp.connections": req.params.id },
                        { $set: { "rsvp.$.enrolled": status } })
                            .then(result => {
                                res.redirect('/users/profile')
                            })
                }
                else {
                    User.findByIdAndUpdate(req.session.user.id,
                        {
                            $push: {
                                rsvp: {
                                    connections: req.params.id,
                                    enrolled: status
                                }
                            }
                        }).then(result => {
                            // console.log("New Val")
                            res.redirect('/users/profile');
                        })
                }
            })
//         });
}


exports.authenticate = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/users/login");
    } else {
        next();
    }
}