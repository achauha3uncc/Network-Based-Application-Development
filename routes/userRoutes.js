const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn, isLoggedOut } = require('../controllers/authController');
// const { isLoggedIn, isLoggedOut } = require('../middlewares/authorization');
const validateLogin = require('../middlewares/validator').validateLogin;
const validateRegistration = require('../middlewares/validator').validateRegistration;


router.get('/create', isLoggedOut, userController.getUserCreate);

router.post('/', isLoggedOut, validateRegistration, userController.postUserCreate);

router.get('/login', isLoggedOut, userController.getUserLogin);

router.post('/login', isLoggedOut,validateLogin, userController.postUserLogin);

router.get('/profile', isLoggedIn, userController.getUserProfile);

router.get('/logout', isLoggedIn, userController.getUserLogout);

router.put('/:id/save', userController.saveConnectionToUser);

router.delete('/:id', userController.deleteConnectionFromUser);

module.exports = router;