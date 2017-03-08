function dance(name, deps) {
    'use strict';

    // deps.client.on('navdata', function(data) {
    //     console.log(JSON.stringify(data, null, 4));
    // });

    deps.io.sockets.on('connection', function(socket) {

        socket.on('/dance/dance1', function(params) {
            console.log("dance1")
            deps.io.sockets.emit('/message', params);
            //deps.client.animate(params.name, params.duration);


           // deps.client.takeoff();

            deps.client
                .after(3000, function() {
                    this.animateLeds('fire', 2, 3);
                }).after(5000, function() {
                  //this.clockwise(.5);
                   this.animateLeds('redSnake', 6, 4);
                }).after(5000, function() {
                   // this.stop();
                    //this.land();
                })
        });

    });
}

module.exports = dance;

// Flying commands, values are between 0 and 1
// takeoff(),stop(),land(),up(.3), down(.2), clockwise(.5),front(.1), back(.2), counterClockwise(.3)
// animateLeds takes name, hz cycles per seconds, and duration in seconds
// values for animateLeds
// blinkGreenRed,blinkGreen,blinkRed,blinkOrange,fire,standard,red,green,redSnake,blank,
// rightMissile,leftMissile,doubleMissile,frontLeftGreenOthersRed,frontRightGreenOthersRed,
// rearRightGreenOthersRed,rearLeftGreenOthersRed,leftGreenRightRed,leftRedRightGreen,blinkStandard
