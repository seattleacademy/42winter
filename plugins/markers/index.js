function markers(name, deps) {

    // Listen to navdata
    deps.client.on('navdata', function(data) {
        // console.log(JSON.stringify(data.visionDetect, null, 4));
    });

    deps.io.sockets.on('connection', function(socket) {
        console.log('connection')
      socket.on('/markers/config', function(cmd) {
            //cmd = JSON.parse(cmd);
            console.log("config", cmd.theKey,cmd.theValue);
           deps.client.config(cmd.theKey, cmd.theValue); 
        });

        socket.on('/markers/detect', function(cmd) {
            console.log("detect", cmd.device_num);

            //FROM https://github.com/felixge/node-ar-drone/issues/134
            deps.client.config('video:video_channel', 3); //optional
            //deps.client.config('general:navdata_demo', 'TRUE');
           // deps.client.config('general:navdata_options', 105971713); //from SDK
            deps.client.config('detect:detect_type', cmd.device_num); // detecting oriendel black-white roundel on the ground
            deps.client.config('detect:detections_select_h', 0); //turning off frontal camera detection
            deps.client.config('detect:detections_select_v', 3); //tag_type oriented roundel
          //  deps.client.config('control:flying_mode', 1 << 1);
        });

        socket.on('/markers/tags', function(cmd) {
            console.log("tags", cmd);

            //FROM https://github.com/felixge/node-ar-drone/issues/134
            deps.client.config('video:video_channel', 0); //optional
            deps.client.config('general:navdata_demo', 'TRUE');
            deps.client.config('general:navdata_options', 105971713); //from SDK
            deps.client.config('detect:enemy_colors', 3); // detecting oriendel black-white roundel on the ground
            deps.client.config('detect:enemy_without_shell', 0); // detecting oriendel black-white roundel on the ground
            deps.client.config('detect:detect_type', 2); // detecting oriendel black-white roundel on the ground
            //deps.client.config('detect:detections_select_h', 8); //turning off frontal camera detection
            //deps.client.config('detect:detections_select_v', 3); //tag_type oriented roundel
            deps.client.config('control:flying_mode', 1 << 1);
        });

    });
}
module.exports = markers;
