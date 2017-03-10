// track.js

(function(window, document, $, undefined) {
    'use strict';
    var Track = function Track(cockpit) {
        this.cockpit = cockpit;

        this.canvas = document.querySelector('#dronestream canvas');

        $('#cockpit').append('<canvas id="trackcanvas"></canvas>');
        $("#controls").prepend('Threshold: <input id="threshold" value="1000" size="5" />');
        $("#controls").prepend(' area: <input id="area" value="" size="5" />');
        $("#controls").prepend(' y: <input id="centery" value="" size="5" />');
        $("#controls").prepend(' x: <input id="centerx" value="" size="5" />');
        $("#controls").prepend(' r: <span id="r1">255</span> g: <span id="g1">0</span> b: <span id="b1">0</span> ');

        this.trackcanvas = $("#trackcanvas")[0];
        this.ctx = this.trackcanvas.getContext('2d');

        this.ctx.canvas.width = this.canvas.clientWidth / 2
        this.ctx.canvas.height = this.canvas.clientHeight / 2
        this.r1 = $("#r1").text();
        this.g1 = $("#g1").text();
        this.b1 = $("#b1").text();
        this.threshold = $("#threshold").val();
        this.count = 2;
        this.tracker = null;
        this.listen();
    };

    Track.prototype.listen = function listen() {
        var track = this;
        track.count = 0;

        // track.on('done', this.hookNextFrame.bind(this));
        //console.log('tracccc', tracking)


	var lastState;
	
	tracking.ColorTracker.registerColor("cup:red", function(r, g, b) {
		// console.log(r,g,b)
		var dx = r - 150,
		dy = g - 50,
		dz = b - 50;

		return dx * dx + dy * dy + dz * dz < 1000; //make this number larger to match more co]ors
	});
	tracking.ColorTracker.registerColor("cup:green", function(r, g, b) {
		// console.log(r,g,b)
		var dx = r - 50,
		dy = g - 120,
		dz = b - 100;

		return dx * dx + dy * dy + dz * dz < 1000; //make this number larger to match more co]ors
	});
	//Tracks the basic colors and the custom color
	var tracker = track.tracker = new tracking.ColorTracker(["cup:red", "cup:green"]);
	//Use this instead of the above if you just want to track the custom color
	//var tracker = new tracking.ColorTracker("custom");

	var canvas = document.getElementById('trackcanvas');
        var context = canvas.getContext('2d');
	tracker.on("track", function(event) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		var greenPos = [];
		var redPos = [];
		event.data.forEach(function(rect) {
			if (rect.color === "cup:red") {
				rect.color = "#FF0000";
				redPos.push(rect.x);
			} else if (rect.color === "cup:green") {
				rect.color = "#00FF00";
				greenPos.push(rect.x);
			}

			context.strokeStyle = rect.color;
			context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			context.font = "11px Helvetica";
			context.fillStyle = rect.color;
			context.fillText("x: " + rect.x + "px", rect.x + rect.width + 5, rect.y + 11);
			context.fillText("y: " + rect.y + "px", rect.x + rect.width + 5, rect.y + 22);
		});

		if (greenPos.length === 0 && redPos.length !== 0) {
			console.log('only red items found');
			lastState = null;
			return;
		} else if (redPos.length === 0 && greenPos.length !== 0) {
			console.log('only green items found');
			lastState = null;
			return;
		} else if (redPos.length === 0 && greenPos.length === 0) {
			console.log('no items found');
			lastState = null;
			return;
		}
		var greenAvgPos = greenPos.length && greenPos.reduce((pos, x) => pos + x, 0) / greenPos.length;
		var redAvgPos = redPos.length && redPos.reduce((pos, x) => pos + x, 0) / redPos.length;

		console.log('green', greenPos, greenAvgPos);
		console.log('red', redPos, redAvgPos);
		var state;
		if (greenAvgPos < redAvgPos) {
			console.log('green left, red right');
			state = 'GREEN_RED';
		} else {
			console.log('red left, green right');
			state = 'RED_GREEN';
		}
		if (lastState && lastState !== state) {
			console.log('FLIP!!!!!');
                    track.cockpit.socket.emit("/track/flip");
			if (state === 'RED_GREEN') track.cockpit.socket.emit('/track/flipLeft');
			else if (state === 'GREEN_RED') track.cockpit.socket.emit('/track/flipRight');

		}
		lastState = state;

	});



        //tracking.track("#trackcanvas", tracker, {camera: true});
        tracking.track("#trackcanvas", track.tracker);
        setInterval(function() {
            tracking.track("#trackcanvas", track.tracker);
        }, 500)

        track.hookNextFrame();

    };

    Track.prototype.update = function(frameBuffer) {
        var track = this;
        var ctx = $("#trackcanvas")[0].getContext('2d');
        var origcanvas = document.querySelector('#dronestream canvas');
        ctx.drawImage(origcanvas, 0, 0);
        this.cockpit.videostream.onNextFrame(this.update.bind(this));
    };

    Track.prototype.hookNextFrame = function() {
        this.cockpit.videostream.onNextFrame(this.update.bind(this));
    };

    window.Cockpit.plugins.push(Track);

}(window, document, jQuery));
