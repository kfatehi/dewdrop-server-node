var mime = require('mime')
  , logger = require('winston')
  , URI = require('uri-js')
  , fs = require('fs')
  , FQDN = null
  , storage = null

var actions = {
  /*
   * ?action=verify POST username=[YOUR USERNAME] password=[YOUR PASSWORD] // returns JSON, you can check data.success
   */
  verify: function (req, res, next) {
    res.status(200).send({success: true})
  },
  /*
   * ?action=upload POST username=[USERNAME] password=[PASSWORD] filenames=FILENAME file file should be called "userfile" // returns data.success for whether it succeeded or not, and data.message for the URL or error message
   * i dont want json in my clipboard... looks like we need to send just a string back
   */
  upload: function (req, res, next) {
    var file = req.files.userfile
    var oldPath = file.path
    var nameParts = file.originalname.split('.')
    var ext = nameParts[nameParts.length-1]
    var path = oldPath+'.'+ext;
    console.info("renaming "+oldPath+" to "+path);
    fs.rename(oldPath, path, function(err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.status(201).send(URI.serialize({
          scheme: FQDN.scheme,
          host: FQDN.host,
          port: FQDN.port,
          path: require('path').basename(path)
        }))
      }
    });
  },
  download: function (req, res, next) {
    var path = require('path').join(storage, req.params.name);
    fs.exists(path, function (yes) {
      if (yes) {
        res.set('Content-Type', mime.lookup(path))
        fs.createReadStream(path).pipe(res)
      } else res.status(404).end()
    })
  },
  /*
   * ?action=browse POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false, files as an array of: filename, extension, size
   */
  browse: function (req, res, next) {
    res.status(501).end()
  },
  /* ?action=get-last-uploaded-file POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false, file with properties: filename, extension, size
   */
  'get-last-uploaded-file': function (req, res, next) {
    res.status(501).end()
  },
  /* ?action=thumb POST filename=[THE FILENAME YOU WANT A THUMB FOR] // returns a graphical representation - use it as an 
   */
  thumb: function (req, res, next) {
    res.status(501).end()
  },
  /* ?action=remove&filename=[FILENAME] POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false
   */
  remove: function (req, res, next) {
    res.status(501).end()
  }
}

module.exports = function (options) {
  var r = require('express').Router()
    , user = options.username
    , pass = options.password

  storage = options.storage
  FQDN = URI.parse(options.serverName);
  if (!FQDN) throw new Error("SERVER_NAME is not valid");
  if (!user) logger.warn("no DEWDROP_USER set");
  if (!pass) logger.warn("no DEWDROP_PASS set");
  if (!user && !pass) logger.warn('everyone is authorized!');
  else logger.warn("hey! make sure you're using SSL!");

  function authorize(req, res, next) {
    var ok = req.body.username === user && req.body.password === pass
    if (ok) next()
      else res.status(401).end();
  };

  function act(req, res, next) {
    actions[req.query.action](req, res, next);
  };

  r.route('/').all(authorize).post(act)

  r.route('/uploads/:name').get(actions.download)

  r.route('/:name').get(actions.download)
  return r;
}
