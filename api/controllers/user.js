const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const User = require('../models/user');
const io = require('../../socket/socket');
const Poker = require('../../game/poker');

exports.user_signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	bcrypt.hash(req.body.password1, 10, function (err, hash) {
		if (err) {
			res.status(500).json({
				error: err,
			});
		} else {
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				username: req.body.username,
				email: req.body.email,
				password: hash,
				country: req.body.country,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				image: null,
				money: 100,
			});
			user
				.save()
				.then(doc => {
					res.status(201).json({
						message: 'success to sign up',
						doc,
					});
				})
				.catch(err => {
					res.status(500).json({ error: err });
				})
				.catch(err => {
					res.status(500).json({ error: err });
				});
		}
	});
};

exports.user_login = (req, res, next) => {
	console.log('body', req.body);
	console.log('username', req.body.username);
	console.log('password', req.body.password);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('errors', errors);
		return res.status(422).json({ errors: errors.array() });
	}

	User.find({ email: req.body.username })
		.exec()
		.then(doc => {
			if (doc.length !== 1) {
				res.status(409).json({
					message: 'Auth faild',
				});
			} else {
				bcrypt.compare(req.body.password, doc[0].password, function (
					err,
					result
				) {
					if (err) {
						res.status(500).json({
							error: err,
						});
					}
					if (result) {
						var token = jwt.sign(
							{
								_id: doc[0]._id,
								username: doc[0].username,
							},
							process.env.JWT_KEY,
							{
								expiresIn: '1h',
							}
						);
						io.getIO().emit('signin', { action: 'push from backend' });
						res.status(200).json({
							message: 'login suceess',
							token,
							doc,
						});
					} else {
						res.status(409).json({
							message: 'Auth faild',
						});
					}
				});
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

exports.user_delete = (req, res, next) => {
	const id = req.params.userId;
	User.remove({ _id: id })
		.exec()
		.then(doc => {
			res.status(200).json({
				message: 'succes to delete the user',
				doc,
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

exports.user_rest = (req, res, next) => {};

exports.user_rest_password = (req, res, next) => {
	console.log('here');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const token = req.params.token;
	User.findOne({ resetToken: token })
		.then(userDoc => {
			if (!userDoc) {
				throw new Error('Not found!');
			}
			bcrypt.hash(req.body.password1, 10, function (err, hash) {
				if (err) {
					res.status(500).json({
						error: err,
					});
				} else {
					userDoc.password = hash;
					userDoc.resetToken = null;
					userDoc.save(doc => {
						res.status(200).json({
							message: 'success to update password',
							doc,
						});
					});
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

exports.test = (req, res, next) => {
	const ob = { id: 2, name: 'nati' };
	const poker = new Poker();
	poker.addPlayer(1);
	poker.addPlayer(2);
	poker.addPlayer(3);

	poker.newRound();
	poker.setScore();

	io.getIO().emit('poker', { flop: poker.flop, players: poker.players });
	console.log('in test');
	res.status(200).json({ message: 'in test end point' });
};
