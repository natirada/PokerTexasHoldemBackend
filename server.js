const http = require('http');
const app = require('./app');

const port = process.env.PORT || 4005;

const server = http.createServer(app);

server.on('listening', function () {
	console.log('ok, server is running...');
});

server.listen(port);

const io = require('./socket').init(server);

io.on('connection', socket => {
	console.log('Clinet connection');
});
