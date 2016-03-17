var http = require('http');
var server = http.createServer().listen(8001);
var io = require('socket.io').listen(server);

console.log("Socket server open");

io.on('connection', function(socket){
	console.log("Socket connection success");

	socket.on("To_mobile", function(data){
		console.log("Mobile message :" + data);
		socket.emit("From_mobile", data);
	});

	socket.on("To_edison", function(data){
		console.log("Edison message : " + data);
		socket.emit("From_edison", data);
	});
})