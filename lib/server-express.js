'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require("mongoose");

var server = (0, _express2.default)();
var PORT = process.env.PORT || 5000;

server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(_express2.default.static(__dirname + '/public'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Test", { useNewUrlParser: true });

var bot = void 0;

server.get('/superscript', function (req, res) {
  res.render('index', { port: PORT, title: "chatbot", text: "Welcome to the SuperScript  Demo!\n" });
});

server.post('/chat-message', function (req, res) {
  if (req.body.message) {
    return bot.reply('newUser', req.body.message.trim(), function (err, reply) {
      res.send(reply);
    });
  }
  return res.send('No message provided.\n');
});

//mongodb start
var nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});
var User = mongoose.model("Employee", nameSchema);

server.get('/mongo', function (req, res) {
  res.render('mongo', { port: PORT, title: "Node and MongoDB" });
});

server.post("/addname", function (req, res) {
  var myData = new User(req.body);
  myData.save().then(function (item) {
    res.send("item saved to database");
  }).catch(function (err) {
    console.log('mongo error == ', err);
    res.status(400).send("unable to save to database");
  });
});
//mongodb end

var options = {
  factSystem: {
    clean: true
  },
  importFile: './data.json',
  mongoURI: 'mongodb://localhost/superscriptDB'
};

_superscript2.default.setup(options, function (err, botInstance) {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  server.listen(PORT, function () {
    console.log('===> \uD83D\uDE80  Server is now running on port ' + PORT);
  });
});