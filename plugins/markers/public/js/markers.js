// markers.js
(function(window, document, $, undefined) {
    'use strict';
    var Markers = function Markers(cockpit) {
        console.log("Loading markers plugin.");
        this.cockpit = cockpit;

        $('#cockpit').append('<canvas id="markersOverlay" width="800" height="600"></canvas>');
        this.markersJquery = $('#markersOverlay');
        this.canvas = this.markersJquery.get(0);
        this.canvas.width = $("#cockpit").width();
        this.canvas.height = $("#cockpit").height();
        this.ctx = this.markersJquery.get(0).getContext('2d');
        this.cockpit.socket.on('navdata', function(data) {
            if (!jQuery.isEmptyObject(data)) {
                requestAnimationFrame(function() {
                    self.render(data);
                });
            }
        });

        $('.main-container .wrapper').append("<div id='markers'></div>");

        $('#markers').append('<div><button id="config">config: </button><input value="detect:enemy_colors" id="key"/><input value="3" size="3" id="value"/></div>');
        $('#markers').append('<button id="roundel">Roundel</button>');
        $('#markers').append('<button id="tags">tags</button>');
        $('#markers').append('<div>counter: <span id="counter">0</span></div>');
        $('#markers').append('<div>nbDetected: <span id="nbDetected">0</span></div>');
        $('#markers').append('<div>type: <span id="type">0</span></div>');
        $('#markers').append('<div>xc: <span id="xc">0</span></div>');
        $('#markers').append('<div>yc: <span id="yc">0</span></div>');
        $('#markers').append('<div>width: <span id="width">0</span></div>');
        $('#markers').append('<div>height: <span id="height">0</span></div>');
        $('#markers').append('<div>dist: <span id="dist">0</span></div>');
        $('#markers').append('<div>orientationAngle: <span id="orientationAngle">0</span></div>');
        $('#markers').append('<div>vision: <span id="vision">0</span></div>');


        var self = this;

        this.cockpit.socket.on('navdata', function(data) {
            //$("#status").text(data.sequenceNumber);
            $("#counter").text(data.sequenceNumber);
            if (!jQuery.isEmptyObject(data.visionDetect)) {
                $("#nbDetected").text(data.visionDetect.nbDetected);
                $("#type").text(data.visionDetect.type);
                $("#xc").text(data.visionDetect.xc);
                $("#yc").text(data.visionDetect.yc);
                $("#width").text(data.visionDetect.width);
                $("#height").text(data.visionDetect.height);
                $("#dist").text(data.visionDetect.dist);
                $("#orientationAngle").text(data.visionDetect.orientationAngle[0].toFixed(1));
                //$("#vision").text(JSON.stringify(data.visionDetect, null, 4));
                //console.log(data.sequenceNumber);
            }
        });
        this.listen();
    };

    Markers.prototype.render = function(data) {
        //console.log(data);
        if (!jQuery.isEmptyObject(data.visionDetect)) {
            var x1 = data.visionDetect.xc[0];
            var y1 = data.visionDetect.yc[0];
            var dist = data.visionDetect.dist[0];
            var theta = data.visionDetect.orientationAngle[0];
            var cw = this.ctx.canvas.width;
            var ch = this.ctx.canvas.height;
            x1 *= cw / 1000
            y1 *= ch / 1000;
            this.ctx.clearRect(0, 0, cw, ch);
            if (data.visionDetect.nbDetected) {
                this.ctx.fillStyle = "rgba(0,0,0,.6";
                this.ctx.strokeStyle = "rgba(255,255,255,.8";
                this.ctx.beginPath();
                var r = 60;
                r *= 100 / dist
                theta = -1 * theta * Math.PI / 180;
                var dx = r * Math.cos(theta) * .5;
                var dy = r * Math.sin(theta) * .5
                var pdx = r * Math.cos(theta + Math.PI * .5);
                var pdy = r * Math.sin(theta + Math.PI * .5)
                var r = 60;
                r *= 125 / dist
                this.ctx.arc(x1, y1, r, 0, 2 * Math.PI);
                this.ctx.lineWidth = 10;
                this.ctx.moveTo(x1 - dx, y1 - dy);
                this.ctx.lineTo(x1 + dx, y1 + dy)
                var lcx = x1 + 5 * dx;
                var lcy = y1 + 5 * dy
                this.ctx.moveTo(lcx + pdx, lcy + pdy);
                this.ctx.lineTo(lcx - pdx, lcy - pdy)
                this.ctx.fill()
                this.ctx.stroke()
            }
        }
    }
    Markers.prototype.listen = function listen() {
        console.log("markers listen")
        var markers = this;


        $('#config').click(function(ev) {
            console.log('config clicked')
            ev.preventDefault();
            var theKey = $('#key').val();
            var theValue = $('#value').val();
            markers.config(theKey,theValue);
        });
        $('#roundel').click(function(ev) {
            console.log('roundel clicked')
            ev.preventDefault();
            markers.detect(12);
        });
        $('#tags').click(function(ev) {
            console.log('tags clicked')
            ev.preventDefault();
            markers.tags(5);
        });

    };
    Markers.prototype.config = function config(theKey,theValue) {
        console.log('config',theKey,theValue)
        this.cockpit.socket.emit("/markers/config", {
            theKey:theKey,
            theValue:theValue
        });
    };

    Markers.prototype.detect = function detect(deviceNum) {
        console.log('detect')
        this.cockpit.socket.emit("/markers/detect", {
            device_num: deviceNum
        });
    };
    Markers.prototype.tags = function detect(deviceNum) {
        console.log('detect')
        this.cockpit.socket.emit("/markers/tags", {
            device_num: deviceNum
        });
    };
    window.Cockpit.plugins.push(Markers);

}(window, document, jQuery));
