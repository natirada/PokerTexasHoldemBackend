const { check } = require('express-validator');
const User = require('../models/user');

exports.login_validator = () => {
	return [
		check('username').isEmail().withMessage('Invalid email'),
		check('password')
			.isLength({ min: 5, max: 10 })
			.withMessage(
				'Invalid password. length password must to contaun 5-10 char'
			),
	];
};

exports.signup_validator = () => {
	return [
		check('email')
			.isEmail()
			.withMessage('Invalid email')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject('Email exists already.');
					}
				});
			}),
		check('username')
			.isAlphanumeric()
			.withMessage(
				'Invalid username. Please Enter a user name with only number and text.'
			)
			.custom((value, { req }) => {
				return User.findOne({ username: value }).then(userDoc => {
					if (userDoc) {
						return Promise.reject('User name exists already.');
					}
				});
			}),
		check('password1')
			.isLength({ min: 5, max: 10 })
			.withMessage(
				'Invalid password. length password must to contaun 5-10 char'
			)
			.isAlphanumeric()
			.withMessage(
				'Invalid password. Please Enter a password with only number and text.'
			),
		check('password2').custom((value, { req }) => {
			if (value !== req.body.password1) {
				throw new Error('Password have to match!');
			}
			return true;
		}),
	];
};

exports.rest_validator = () => {
	return [
		check('email')
			.isEmail()
			.withMessage('Invalid email')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(userDoc => {
					if (!userDoc) {
						return Promise.reject('the user not exists.');
					}
				});
			}),
	];
};

exports.rest_password_validator = () => {
	return [
		check('password1')
			.isLength({ min: 5, max: 10 })
			.withMessage(
				'Invalid password. length password must to contaun 5-10 char'
			),
		check('password2').custom((value, { req }) => {
			if (value !== req.body.password1) {
				throw new Error('Password have to match!');
			}
			return true;
		}),
	];
};
