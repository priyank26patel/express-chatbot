'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
var PORT = process.env.PORT || 5000;

server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(_express2.default.static(__dirname + '/public'));

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

var options = {
  factSystem: {
    clean: true
  },
  importFile: './data.json'
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