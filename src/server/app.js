module.exports = function(options) {
  var  multer  = require('multer')
    , express = require('express')
    , fs = require('fs')
    , app = express()
    , http = require('http').Server(app)
    , bodyParser = require('body-parser')
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "X-Filename");
    res.header("Access-Control-Allow-Headers", "Referer, Range, Accept-Encoding, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });
  app.use(multer({ dest: options.storage }))
  app.use(bodyParser.json({limit: '10mb'}));
  app.use(require('./router')(options));
  return http;
}
