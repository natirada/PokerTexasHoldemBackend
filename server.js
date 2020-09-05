const http = require('http');
const app = require('./app');
const socket = require('./socket/socket');

const port = process.env.PORT || 4005;

const server = http.createServer(app);

server.on('listening', function () {
	console.log('ok, server is running...');
});

server.listen(port);

//const io = require('./socket/socket').init(server);
socket.init(server);
socket.connection();
