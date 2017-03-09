// track.js

(function(window, document, $, undefined) {
    'use strict';
    var Track = function Track(cockpit) {
        this.cockpit = cockpit;

        this.canvas = document.querySelector('#dronestream canvas');

        console.log('found canvas, width/height:', this.canvas.clientWidth, this.canvas.clientHeight);
        $('#cockpit').append('<canvas id="trackcanvas"></canvas>');
        $("#controls").prepend('Threshold: <input id="threshold" value="1000" />');
        $("#controls").prepend('out: <input id="out" value="1000" />');
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
        console.log('tracccc', tracking)

        tracking.ColorTracker.registerColor("c1", function(r, g, b) {
            //console.log(track.r1,track.threshold)
            track.count--
                //$("#out").val(track.count);
                var dx = r - track.r1;
            var dy = g - track.g1;
            var dz = b - track.b1;

            return dx * dx + dy * dy + dz * dz < track.threshold;
        });

        track.tracker = new tracking.ColorTracker(["c1"]);
        console.log('tracker', track.tracker)

        //tracking.track("#trackcanvas", tracker, {camera: true});
        tracking.track("#trackcanvas", track.tracker);
        setInterval(function() {
            console.log('trackmeee')
            tracking.track("#trackcanvas", track.tracker);
        }, 1000)
        console.log(track.tracker, "trackme")


        track.tracker.on('track', function(event) {
            function rgb(r, g, b) {
                return "rgb(" + r + "," + g + "," + b + ")";
            }
             //track.ctx.clearRect(0, 0, this.trackcanvas.width, this.trackcanvas.height);
            if (event.data.length == 0) return;

            event.data.sort(function(a, b) {
                return a.height * a.width - b.height * b.width;
            });

            var rect = event.data[0]; //The rect with the largest area
            track.ctx.strokeStyle = rgb(r1, g1, b1);
            track.ctx.lineWidth = 4
            track.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            console.log("largest Rect",rect.width * rect.height)
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

        $('#threshold').change(function(e) {
            track.threshold = $("#threshold").val();
        });

        $('#trackcanvas').click(function(e) {
            var position = findPos(this);
            var x = e.pageX - position.x;
            var y = e.pageY - position.y;
            var canvas = $("#trackcanvas")[0].getContext('2d');
            var p = canvas.getImageData(x, y, 1, 1).data;
            $("#r1").text(p[0]);
            $("#g1").text(p[1]);
            $("#b1").text(p[2]);
            track.r1 = p[0];
            track.g1 = p[1];
            track.b1 = p[2];
            e.preventDefault();
        });

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
