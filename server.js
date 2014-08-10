var app = require(__dirname+'/src/server/app.js')
  , port = process.env.PORT || 3000
  , logger = require('winston')
  , path = require('path')
  , fs = require('fs')

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

var storage = process.env.DEWDROP_STORAGE || path.join(__dirname, 'uploads')
logger.info("DEWDROP_STORAGE="+storage);
var serverName = process.env.SERVER_NAME || "http://localhost:3000/";
logger.info("SERVER_NAME="+serverName);
var testFile = path.join(storage, '.write-test');
fs.writeFile(testFile, '', function (err) {
  if (err) {
    logger.error("Can't write files in DEWDROP_STORAGE "+storage);
    process.exit(1);
  } else {
    app({
      storage: storage,
      serverName: serverName,
      username: process.env.DEWDROP_USER,
      password: process.env.DEWDROP_PASS
    }).listen(port, '0.0.0.0');
    logger.info("listening on http://0.0.0.0:"+port);
    fs.unlink(testFile);
  }
})
