function track(name, deps){
	console.log("tracker activated")
	deps.io.sockets.on('connection', function (socket) {
        socket.on('/track/flipLeft', function () {
	   console.log('flipLeft');
           return deps.client.animate('flipLeft', 500);
        });
        socket.on('/track/flipRight', function () {
	   console.log('flipRight');
           return deps.client.animate('flipRight', 500);
        });
	});
};

module.exports = track
