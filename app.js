const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const gameRoutes = require('./api/routes/game');

mongoose.connect(
	`mongodb+srv://netanel:${process.env.MONGO_ATLAS_PASSWORD}@node-rest-api-vx9n6.mongodb.net/test?retryWrites=true&w=majority`,
	{ useNewUrlParser: true }
);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requseted-With, Content-Type, Accept, Authorization'
	);
	if (res.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
		return res.status(200).json({});
	}
	next();
});

app.use('/user', userRoutes);
app.use('/game', gameRoutes);

app.use((req, res, next) => {
	const error = new Error('Not Found.');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
