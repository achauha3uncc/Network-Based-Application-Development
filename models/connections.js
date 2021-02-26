const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    // connectionId: {
    //     type: Number,
    //     required: true,
    // },
   
    title: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true
    },

    details: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },

    startingTime: {
        type: String,
        required: true
    },

    endingTime: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },
    
    host: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },

    numberOfEnrollments: {
        type: Number,
        default: 0
    },

    imageURL: {
        type: String,
        default: 'https://images.alphacoders.com/717/717234.jpg'
    },

    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

const Connections = mongoose.model('Connections', connectionSchema);

module.exports = Connections;