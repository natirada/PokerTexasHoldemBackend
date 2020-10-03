//  users = {
// 	roomNumber ('5656'): {
// 		poker: new Poker(),
// 		users: [ {
// 			socketId,
// 			playerId,
// 			userName

// 		},...]
// 	}
// 	.....
// }
const users = {};

const Poker = require('../../game/poker');

// Join user to chat
function userJoin(dataPlayer) {
	try {
		if (users[dataPlayer.room]) {
			const isNotExsits =
				users[dataPlayer.room].users.findIndex(
					player => player.playerId === dataPlayer.playerId
				) === -1;
			if (isNotExsits) {
				users[dataPlayer.room].users.push(dataPlayer);
				users[dataPlayer.room].poker.addPlayer(dataPlayer.playerId);
			}
		} else {
			users[dataPlayer.room] = {
				users: [dataPlayer],
				poker: new Poker(),
			};
			users[dataPlayer.room].poker.addPlayer(dataPlayer.playerId);
		}

		return dataPlayer;
	} catch (error) {
		console.log(error);
	}
}

// Get current user
function getCurrentUser(id) {
	const currUser = Object.values(users)
		.reduce((acc, curr) => {
			return [...acc, ...curr.users];
		}, [])
		.find(user => user.socketId === id);
	return currUser;
}

// User leaves chat
function userLeave(roomId, playerId) {
	const index = users[roomId].users.findIndex(
		user => user.playerId === playerId
	);

	if (index !== -1) {
		users[roomId].poker.removePlayer(playerId);
		users[roomId].users.splice(index, 1);
		console.log('users.length', users[roomId].users.length);
	}
	return users;
}

// Get room users
function getRoomUsers(room) {
	//	return users.filter(user => user.room === room);
	return users[room];
}

// Get ALL  users
function getAllUsers() {
	return users;
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	getAllUsers,
};
