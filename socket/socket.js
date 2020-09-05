const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	getAllUsers,
} = require('./utilis/users');
const Poker = require('../game/poker');
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

					console.log(getAllUsers());

					socket.join(user.room);

					// Welcome current user
					socket.emit('message', 'Welcome to ChatCord!');

					// Broadcast when a user connects
					socket.broadcast
						.to(user.room)
						.emit('message', 'user has joined the chat');

					// Send users and room info
					io.to(user.room).emit('roomUsers', {
						room: user.room,
						users: getRoomUsers(user.room),
					});
				});

				// Listen for move
				socket.on('play', msg => {
					const user = getCurrentUser(socket.id);
					console.log('on play user', user);
					io.to(user.room).emit('play', { userName: user.username, msg });
				});
			});
		}
	},
};
