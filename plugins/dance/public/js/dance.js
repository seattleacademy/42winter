(function(window, document, $, undefined) {
    'use strict';
    var Dance = function Dance(cockpit) {
        console.log("Loading dance plugin.");
        this.cockpit = cockpit;
        $("#controls").prepend('<button id="dance">dance</button>');

        this.listen();
    };

    Dance.prototype.listen = function listen() {
        var dance = this;

        $('#dance').click(function(ev) {
            ev.preventDefault();
            dance.dance1();
        });

    };

    Dance.prototype.dance1 = function config(name, duration) {

        this.cockpit.socket.emit("/dance/dance1");
    };

    window.Cockpit.plugins.push(Dance);

}(window, document, jQuery));