var express = require('express');
var r = module.exports = express.Router();
//var _ = require('lodash');
var logger = require('winston')
//var Promise = require('bluebird');

var user = process.env.DEWDROP_USER;
var pass = process.env.DEWDROP_PASS;

if (!user) logger.warn("no DEWDROP_USER set")
if (!pass) logger.warn("no DEWDROP_PASS set")
if (!user && !pass) logger.warn('everyone is authorized!')
else logger.warn("hey! make sure you're using SSL!")

function authorize(req, res, next) {
  var ok = req.body.username === user && req.body.password === pass
  if (ok) next()
  else res.status(401).end()
}

function act(req, res, next) {
  actions[req.query.action](req, res, next)
}

var actions = {
  /*
   * ?action=verify POST username=[YOUR USERNAME] password=[YOUR PASSWORD] // returns JSON, you can check data.success
   */
  verify: function (req, res, next) {
    res.status(200).send({success: true})
  },
  /*
   * ?action=upload POST username=[USERNAME] password=[PASSWORD] filenames=FILENAME file file should be called "userfile" // returns data.success for whether it succeeded or not, and data.message for the URL or error message
   */
  upload: function (req, res, next) {
    res.status(501).end()
  }
}

r.route('/').post(authorize, act)


/*
 * ?action=browse POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false, files as an array of: filename, extension, size
 *
 * ?action=get-last-uploaded-file POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false, file with properties: filename, extension, size
 *
 * ?action=thumb POST filename=[THE FILENAME YOU WANT A THUMB FOR] // returns a graphical representation - use it as an 
 *
 * ?action=remove&filename=[FILENAME] POST username=[USERNAME] password=[PASSWORD] // returns data.success for true/false
 */
