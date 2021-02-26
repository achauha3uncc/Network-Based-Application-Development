const express = require('express');
const router = express.Router();

const connectionsController = require('../controllers/connectionsController');
const isLoggedIn = require('../controllers/authController').isLoggedIn;
const validateConnections = require('../middlewares/validator').validateConnections;
// const connectionsController = require('../controllers/connectionsController');
// const isLoggedIn = require('../middlewares/authorization').isLoggedIn;

// router.use('/', isLoggedIn);

router.get('/', connectionsController.getAllConnections);

router.post('/', validateConnections, connectionsController.createConnections);

router.get('/create', connectionsController.getConnectionCreate);

router.get('/:id/update', connectionsController.getConnectionUpdate);

router.get('/:id', connectionsController.getConnectionsDetail);

router.post('/:id/enrolledStatus', isLoggedIn, connectionsController.saveEnrolledStatus);

// router.get('/profile', isLoggedIn, connectionsController.getSavedConnections);

router.put('/:id', validateConnections, connectionsController.updateConnections);

router.delete('/:id', connectionsController.deleteConnections);

module.exports = router;