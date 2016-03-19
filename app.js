var http = require('http');
var server = http.createServer().listen(8001);
var io = require('socket.io').listen(server);

console.log("Socket server open");

var allClients = [];
var room = 'Lobby';

io.on('connection', function(socket){

	socket.on("adduser", function(username){
		// identify users
		if(username == 'edison'){
			if(searchUser('edison', allClients) != -1){
				socket.emit("updateuser", {connection : false, message : "Edison already exist"});
			}else{
				allClients.push({'socket': socket, 'Usertype' : 'edison'});
				socket.join(room);
				socket.emit("updateuser", Userstate(allClients));
				socket.broadcast.to(room).emit("updateuser", Userstate(allClients));
			}
		}else if(username == 'mobile'){
			if(searchUser('mobile', allClients) != -1){
				socket.emit("updateuser", {connection : 'False', message : "Mobile already exist"});
			}else{
				allClients.push({'socket': socket, 'Usertype' : 'mobile'});
				socket.join(room);
				socket.emit("updateuser", Userstate(allClients));
				socket.broadcast.to(room).emit("updateuser",Userstate(allClients));
			}
		}else{
			allClients.push({'socket': socket, 'Usertype' : 'guest'});
			socket.join(room);
			socket.emit("updateuser", Userstate(allClients));
			socket.broadcast.to(room).emit("updateuser",Userstate(allClients));
		}
	});

	socket.on("disconnect",function(){
		var i = searchSocket(socket, allClients);
		if(i != -1){
			allClients.splice(i,1);
			socket.broadcast.to(room).emit("updateuser",Userstate(allClients));
		}
	});

	socket.on("To_mobile", function(data){
		console.log("Edison message :" + data);
		socket.broadcast.to(room).emit("From_edison", data);
	});

	socket.on("To_edison", function(data){
		console.log("Mobile message : " + data);
		socket.broadcast.to(room).emit("From_mobile", data);
	});
})


function searchUser(userType, myArray){
	for(var i=0;i < myArray.length; i++){
		if(myArray[i].Usertype == userType)
			return i;
	}
	return -1;
}

function searchSocket(socket, myArray){
	for(var i=0;i < myArray.length; i++){
		if(myArray[i].socket == socket)
			return i;
	}
	return -1;
}

function Userstate(Clients){
	var edison = searchUser('edison', Clients);
	var mobile = searchUser('mobile', Clients);
	var user_len = Clients.length;
	var edison_avail = false, mobile_avail = false;

	if(edison != -1)
		edison_avail = true;
	if(mobile != -1)
		mobile_avail = true;

	var message = {connection : true, edison : edison_avail, mobile : mobile_avail, users : user_len};
	return message;
}
