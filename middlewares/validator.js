const check = require('express-validator').check;

exports.validateRegistration = [
    check('firstName' , 'contains only letters').notEmpty().trim().isAlpha(),
    check('lastName' , 'contains only letters').notEmpty().trim().isAlpha(),
    check('email', 'Invalid email').isEmail().normalizeEmail().trim(),
    check('password', 'password must contain at least 5 characters').isLength({ min: 5})
];

exports.validateLogin = [
    check('email', 'Invalid email').isEmail().normalizeEmail().trim(),
    check('password', 'password must contain at least 5 characters').isLength({ min: 5})
];

exports.validateConnections = [
    // check('title' , 'contains only letters').notEmpty().trim().isAlpha(),
    // check('category' , 'Category should not be empty').notEmpty().trim().isAlpha(),
    // check('details' , 'contains only letters').notEmpty(),
    // check('date' , 'contains only date').notEmpty().trim().isAlpha(),
    // check('startingTime' , 'contains only starting time of event').notEmpty(),
    // check('endingTime' , 'contains only ending time of event').notEmpty(),
    // check('location' , 'contains only letters').notEmpty(),
    // check('host' , 'contains only letters').notEmpty().trim().isAlpha(),
    check('imageURL' , 'Please provide an image URL with .jpg').notEmpty()

];




