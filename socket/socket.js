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
					try {
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

						if (roomsUsers.users.length === 2) {
							// Send users and room info
							roomsUsers.poker.startNewHands();
							roomsUsers.poker.setScore();
							io.to(user.room).emit('roomUsers', {
								flop: roomsUsers.poker.flop,
								players: roomsUsers.poker.players,
							});
							startGame(user.room);
						}
					} catch (error) {
						console.log('error', error);
					}
				});

				// Listen for move
				socket.on('play', payload => {
					const user = getCurrentUser(socket.id);
					const room = getRoomUsers(user.room);
					room.poker.action(payload);
					//	io.to(user.room).emit('play', { userName: user.username, msg });
				});

				const startGame = roomId => {
					const room = getRoomUsers(roomId);

					room.poker.emitter.on('cahngePlayer', playerTurn => {
						io.to(roomId).emit('turn', {
							playerIdTurn: playerTurn.playerId,
						});
					});

					room.poker.emitter.on('roundEnded', data => {
						io.to(roomId).emit('roundEnded', data);
					});
					room.poker.emitter.on('playerAction', payload => {
						console.log('playerAction payload:', payload);

						io.to(roomId).emit('playerAction', payload);
					});

					room.poker.startRound();
				};

				socket.on('exitRoom', data => {
					try {
						const user = getCurrentUser(socket.id);
						const { room, playerId } = user;
						const usersUpdate = userLeave(room, playerId);
						console.log('****!!!usersUpdate after delete*', usersUpdate);
					} catch (error) {
						console.log('error');
					}
				});
			});
		}
	},
};
