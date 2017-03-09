// track.js

(function(window, document, $, undefined) {
    'use strict';
    console.log("loading track")
    var Track = function Track(cockpit) {
        console.log("Loading track plugin.");
        this.cockpit = cockpit;

        this.canvas = document.querySelector('#dronestream canvas');
        if (!this.canvas) {
            console.error('Did not find required dronestream canvas');
            return;
        }
        console.log('found canvas, width/height:', this.canvas.clientWidth, this.canvas.clientHeight);
        // $("#controls").prepend('<button id="animateLeds">animateLeds</button>');

        // $('#cockpit').append('<img id="img" src="/plugin/track/images/psmove.png" />');
        // $('#cockpit').append('<img id="droneblue" src="/plugin/track/images/droneblue.png" />');
        $('#cockpit').append('<canvas id="trackcanvas"></canvas>');
        var ctx = $("#trackcanvas")[0].getContext('2d');
        
        ctx.canvas.width = this.canvas.clientWidth
        ctx.canvas.height = this.canvas.clientHeight
        

        this.listen();
    };

    Track.prototype.listen = function listen() {
        var track = this;
    
        track.hookNextFrame();
        // track.on('done', this.hookNextFrame.bind(this));

        
        tracking.ColorTracker.registerColor('droneblue', function(r, g, b) {

            var dx = r - 57;
            var dy = g - 102;
            var dz = b - 137;
            //console.log('bluediff',dx * dx + dy * dy + dz * dz)
            return dx * dx + dy * dy + dz * dz < 100;
        });
        var colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow', 'droneblue']);

        colors.on('track', function(event) {
            console.log('trackkk')
            if (event.data.length === 0) {
                // No colors were detected in this frame.
            } else {
                event.data.forEach(function(rect) {
                    console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
                });
            }
        });

        $('#trackcanvas').click(function(ev) {
            console.log('click')
            ev.preventDefault();
            //tracking.track('#droneblue', colors);
            tracking.track('#trackcanvas', colors);
        });

    };

    Track.prototype.track = function track(params) {

        this.cockpit.socket.emit("/track/track1", {
            params
        });
    };

    Track.prototype.update = function(frameBuffer) {
        
        console.log("frame has been buffered");
                this.cockpit.videostream.onNextFrame(this.update.bind(this));

        //this.emit('done1');
    };

    Track.prototype.hookNextFrame = function() {
        this.cockpit.videostream.onNextFrame(this.update.bind(this));
    };

    window.Cockpit.plugins.push(Track);

}(window, document, jQuery));