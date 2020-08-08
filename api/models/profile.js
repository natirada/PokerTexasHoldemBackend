const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	username: { type: String, required: true },
	email: { type: String, required: true },
	country: String,
	firstName: String,
	lastName: String,
	image: String,
	money: { type: Number, defalut: 100 },
});

module.exports = mongoose.model('Profile', profileSchema);
