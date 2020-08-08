const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	country: String,
	resetToken: String,
	country: String,
	firstName: String,
	lastName: String,
	image: String,
	money: { type: Number, defalut: 100 },
});

module.exports = mongoose.model('User', userSchema);
