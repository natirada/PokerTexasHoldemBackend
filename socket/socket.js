const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	getAllUsers,
} = require('./utilis/users');

let io;
module.exports = {
	init: httpServer => {
		io = require('socket.io')(httpServer);
		return io;
	},
	getIO: () => {
		if (!io) {
			throw new Error('Socket.io not intaialized');
		}
		return io;
	},
	connection: () => {
		if (io) {
			io.on('connection', socket => {
				console.log('connection');

				socket.on('joinRoom', dataPlayer => {
					const user = userJoin({ ...dataPlayer, socketId: socket.id });

					console.log('user joi', user);

					socket.join(user.room);

					// Welcome current user
					socket.emit('message', 'Welcome to ChatCord!');

					// Broadcast when a user connects

					socket.broadcast
						.to(user.room)
						.emit('newRound', 'user has joined the chat');

					const roomsUsers = getRoomUsers(user.room);

					console.log('roomsUsers.users.length', roomsUsers.users.length);

					if (roomsUsers.users.length >= 2) {
						// Send users and room info
						roomsUsers.poker.newRound();
						roomsUsers.poker.setScore();
						io.to(user.room).emit('roomUsers', {
							flop: roomsUsers.poker.flop,
							players: roomsUsers.poker.players,
						});
						startGame(user.room);
					}
				});

				// Listen for move
				socket.on('play', msg => {
					const user = getCurrentUser(socket.id);
					console.log('on play user', user);
					io.to(user.room).emit('play', { userName: user.username, msg });
				});

				const startGame = roomId => {
					const room = getRoomUsers(roomId);

					room.poker.emitter.on('cahngePlayer', playerTurn => {
						console.log('the turn now is for this player: --->', playerTurn);
						io.to(roomId).emit('turn', {
							playerIdTurn: playerTurn.playerId,
						});
					});

					room.poker.startRound();
					// io.to(roomId).emit('turn', {
					// 	playerIdTurn: room.users[0].playerId,
					// });
					// room.users.forEach((player, index) => {
					// 	if (index > 0) {
					// 		const setTimeoutId = setTimeout(() => {
					// 			io.to(roomId).emit('turn', {
					// 				playerIdTurn: player.playerId,
					// 			});
					// 		}, 1000 * 10 * index);
					// 	}
					// });
				};
			});
		}
	},
};
