'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _repl = require('repl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require("mongoose");
var ejs = require('ejs');
// var mainRoutes = require('../routes/main')

var server = (0, _express2.default)();
var PORT = process.env.PORT || 5000;

// server.use(mainRoutes);
server.use(_bodyParser2.default.json());
server.use(_bodyParser2.default.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(_express2.default.static(__dirname + '/public'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/chatbot", { useNewUrlParser: true });

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
  console.log('req.body ==', req.body);
  var myData = new User(req.body);
  myData.save().then(function (item) {
    res.send("item saved to database");
  }).catch(function (err) {
    console.log('mongo error == ', err);
    res.status(400).send("unable to save to database");
  });
});
//mongodb end


// admin start
var gambitSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    default: 'master'
  },
  trigger: String,
  input: String,
  redirect: {
    type: String,
    default: ''
  },
  reply_order: {
    type: String,
    default: 'random'
  },
  replies: {
    type: Array
  },
  filter: {
    type: String,
    default: null
  },
  conditions: {
    type: String,
    default: null
  },
  isQuestion: {
    type: Boolean,
    default: false
  },
  id: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});
var Gambits = mongoose.model("ss_gambits", gambitSchema);

var replySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    default: 'master'
  },
  reply: String,
  parent: String,
  gambits: [],
  filter: {
    type: String,
    default: null
  },
  keep: {
    type: Boolean,
    default: false
  },
  id: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});
var Replies = mongoose.model("ss_replies", replySchema);

var topicSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'random'
  },
  tenantId: {
    type: String,
    default: 'master'
  },
  gambits: [],
  nostay: {
    type: Boolean,
    default: false
  },
  system: {
    type: Boolean,
    default: false
  },
  keywords: [],
  filter: {
    type: String,
    default: null
  },
  reply_order: {
    type: String,
    default: null
  },
  reply_exhaustion: {
    type: String,
    default: 'keep'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
var Topics = mongoose.model("ss_topics", topicSchema);

server.get('/admin', function (req, res) {
  res.render('admin', { port: PORT, title: "chatbot" });
});

server.post("/save-chatbot", function (req, res) {
  var gambits = new Gambits();
  gambits.trigger = req.body.trigger;
  gambits.input = req.body.trigger;
  gambits.save(function (err, gambitInserted) {
    if (err) throw err;

    var replies = new Replies();
    replies.reply = req.body.reply;
    replies.parent = gambitInserted._id;
    var result2 = replies.save(function (err, replyInserted) {
      if (err) throw err;
      //console.log('replyInserted == ',replyInserted._id)

      Gambits.update({ _id: gambitInserted._id }, { replies: replyInserted._id.toString() }, { multi: true }, function (err, res) {
        if (err) throw err;
      });
    });

    var topics = new Topics();
    topics.gambits = gambitInserted._id.toString();
    topics.save(function (err, topicInserted) {
      if (err) throw err;
      //res.send("Date saved to chatbot collection.");
      res.redirect('/admin');
    });
  });
});
// admin end


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