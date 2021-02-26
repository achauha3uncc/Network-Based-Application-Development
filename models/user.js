const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    connections: {
        type: Schema.Types.ObjectId,
        ref: 'Connections'
    },
    enrolled: {
        type: String
    }
},{_id: false });


const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rsvp: [rsvpSchema]
    // savedConnection: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'connection'
    //     //default
    // }]
});

userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        }).catch(err => {
            console.log('error in the password');
            next();
        })
});


userSchema.methods.comparePassword = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
}


const User = mongoose.model('User', userSchema);
module.exports = User;