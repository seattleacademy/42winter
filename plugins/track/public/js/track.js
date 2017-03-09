// track.js

(function(window, document, $, undefined) {
    'use strict';
    var Track = function Track(cockpit) {
        this.cockpit = cockpit;

        this.canvas = document.querySelector('#dronestream canvas');

        console.log('found canvas, width/height:', this.canvas.clientWidth, this.canvas.clientHeight);
        $('#cockpit').append('<canvas id="trackcanvas"></canvas>');
        $("#controls").prepend('Threshold: <input id="threshold" value="1000" />');
        $("#controls").prepend(' r: <span id="r1">255</span> g: <span id="g1">0</span> b: <span id="b1">0</span> ');

        var ctx = $("#trackcanvas")[0].getContext('2d');
        
        ctx.canvas.width = this.canvas.clientWidth
        ctx.canvas.height = this.canvas.clientHeight
        this.ctx = ctx;

        this.listen();
    };

    Track.prototype.listen = function listen() {
        var track = this;
    
        track.hookNextFrame();
        // track.on('done', this.hookNextFrame.bind(this));


        tracking.ColorTracker.registerColor("c1", function(r, g, b) {
            var dx = r - $("#r1").text();
            var dy = g - $("#g1").text();
            var dz = b - $("#b1").text();

            return dx * dx + dy * dy + dz * dz < $("#threshold").val();
        });

        var tracker = new tracking.ColorTracker(["c1"]);
        console.log('tracker',tracker)

        //tracking.track("#trackcanvas", tracker, {camera: true});
        tracking.track("#trackcanvas", tracker);
        
 
        tracker.on('track', function(event) {
            console.log('trackkk')
            if (event.data.length === 0) {
                // No colors were detected in this frame.
            } else {
                event.data.forEach(function(rect) {
                    console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
                });
            }
        });

        function findPos(obj) {
            var current_left = 0,
                current_top = 0;
            if (obj.offsetParent) {
                do {
                    current_left += obj.offsetLeft;
                    current_top += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return {
                    x: current_left,
                    y: current_top
                };
            }
            return undefined;
        }

        $('#trackcanvas').click(function(e) {
            var position = findPos(this);
            var x = e.pageX - position.x;
            var y = e.pageY - position.y;
            var canvas = $("#trackcanvas")[0].getContext('2d');
            var p = canvas.getImageData(x, y, 1, 1).data;
            $("#r1").text(p[0]);
            $("#g1").text(p[1]);
            $("#b1").text(p[2]);
            var r1 = p[0];
            var g1 = p[1];
            var b1 = p[2];
            e.preventDefault();
        });

    };

    Track.prototype.update = function(frameBuffer) {
        var track = this;
        var ctx = $("#trackcanvas")[0].getContext('2d');
        var origcanvas = document.querySelector('#dronestream canvas');
        ctx.drawImage(origcanvas,0,0);
        this.cockpit.videostream.onNextFrame(this.update.bind(this));
    };

    Track.prototype.hookNextFrame = function() {
        this.cockpit.videostream.onNextFrame(this.update.bind(this));
    };

    window.Cockpit.plugins.push(Track);

}(window, document, jQuery));