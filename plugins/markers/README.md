# webflight markers plugin

This is a plugin for the browser-based AR.Drone ground control station
[webflight](http://eschnou.github.io/ardrone-webflight/) that adds vision
capability for various markers

![Preview Image](screenshot.png)

## Running the software

You will need the
[ardrone-webflight](https://github.com/eschnou/ardrone-webflight) and
markers repos:

```
git clone git://github.com/eschnou/ardrone-webflight.git
git clone https://github.com/seattleacademy/webflight-markers.git
```

Run `npm install` for each:

```
(cd webflight-markers && npm install)
(cd ../ardrone-webflight && npm install)
```

Plus `bower install` for webflight in the ardrone-webflight directory:

```
sudo npm install -g bower
bower install
```

Link `webflight-markers` into webflight's `plugins` directory:

```
(cd plugins && ln -s ../../webflight-markers markers)
```

Copy ardrone-webflight's `config.js.example` to `config.js`:

```
(cd ardrone-webflight && cp config.js.example config.js)
```

Add `"markers"` to the `plugins` array in `config.js`
so it looks something like this:

```javascript
var config = {
  plugins: [
  "hud"
  , "pilot"
  , "video-stream"
  , "battery"
  , "markers"
  ]
};

module.exports = config;
```

### Start the server

Now you can start the webflight server:

```
cd ardrone-webflight
PORT='3000' DEFAULT_DRONE_IP='192.168.1.1' node app.js
```

Point your browser at http://localhost:3000/