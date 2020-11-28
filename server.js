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

// "scripts": {
// 	"start": "MONGO_ATLAS_PASSWORD=aa9432651 JWT_KEY=1234567 SENDGRID_API_KEY=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 node server.js"
// },
