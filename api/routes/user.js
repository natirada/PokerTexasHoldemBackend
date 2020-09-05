const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const UserController = require('../controllers/user');
const UserValidator = require('../middleware/validation');

router.post(
	'/signup',
	UserValidator.signup_validator(),
	UserController.user_signup
);

router.post(
	'/login',
	UserValidator.login_validator(),
	UserController.user_login
);

router.delete('/:userId', UserController.user_delete);

router.post('/rest', UserValidator.rest_validator(), UserController.user_rest);

router.get(
	'/rest/:token',
	UserValidator.rest_password_validator(),
	UserController.user_rest_password
);

router.get('/test', UserController.test);

module.exports = router;
