const mongoose = require('mongoose');

const io = require('../../socket/socket');
const Poker = require('../../game/poker');

exports.play = (req, res, next) => {
	io.getIO().on('connection', socket => {
		// socket.on('joinRoom', room => {
		// 	console.log('room', room);
		// });
		console.log('Clinet connection');
	});

	res.status(200).json({ message: 'succes' });
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
