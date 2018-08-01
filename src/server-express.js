import superscript from 'superscript';
import express from 'express';
import bodyParser from 'body-parser';
import { start } from 'repl';
var mongoose = require("mongoose");
var ejs = require('ejs');
// var mainRoutes = require('../routes/main')

const server = express();
const PORT = process.env.PORT || 5000;

// server.use(mainRoutes);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'))

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/chatbot", { useNewUrlParser: true });

let bot;

server.get('/superscript', (req, res) => {
  res.render('index',{port:PORT,title:"chatbot",text:"Welcome to the SuperScript  Demo!\n"})
});

server.post('/chat-message', (req, res) => {
	if (req.body.message) {
		return bot.reply('newUser', req.body.message.trim(), (err, reply) => {
			res.send(reply);
		});
	}
	return res.send('No message provided.\n');
})

//mongodb start
var nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
 });
var User = mongoose.model("Employee", nameSchema);

server.get('/mongo', (req, res) => {
  res.render('mongo',{port:PORT,title:"Node and MongoDB"})
});

server.post("/addname", (req, res) => {
  console.log('req.body ==',req.body)
  var myData = new User(req.body);
  myData.save()
  .then(item => {
    res.send("item saved to database");
  })
  .catch(err => {
    console.log('mongo error == ',err)
    res.status(400).send("unable to save to database");
  });
});
//mongodb end


// admin start
let gambitSchema = new mongoose.Schema({
  tenantId: {
    type:String,
    default:'master'
  },
  trigger: String,
  input: String,
  redirect: {
    type:String,
    default:''
  },
  reply_order: {
    type:String,
    default:'random'
  },
  replies: {
    type:Array
  },
  filter: {
    type:String,
    default:null
  },
  conditions: {
    type:String,
    default:null
  },
  isQuestion: {
    type:Boolean,
    default:false
  },
  id: String,
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});
let Gambits = mongoose.model("ss_gambits", gambitSchema);

let replySchema = new mongoose.Schema({
  tenantId: {
    type:String,
    default:'master'
  },
  reply: String,
  parent: String,
  gambits: [],
  filter: {
    type:String,
    default:null
  },
  keep: {
    type:Boolean,
    default:false
  },
  id: String,
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});
let Replies = mongoose.model("ss_replies", replySchema);

let topicSchema = new mongoose.Schema({
  name: {
    type:String,
    default:'random'
  },
  tenantId: {
    type:String,
    default:'master'
  },
  gambits: [],
  nostay: {
    type:Boolean,
    default:false
  },
  system: {
    type:Boolean,
    default:false
  },
  keywords: [],
  filter: {
    type:String,
    default:null
  },
  reply_order: {
    type:String,
    default:null
  },
  reply_exhaustion: {
    type:String,
    default:'keep'
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});
let Topics = mongoose.model("ss_topics", topicSchema);

server.get('/admin', (req, res) => {
  res.render('admin',{port:PORT,title:"chatbot"})
})


server.post("/save-chatbot", (req, res) => {
  let gambits = new Gambits()
  gambits.trigger = req.body.trigger
  gambits.input = req.body.trigger
  gambits.save(function(err,gambitInserted) {
      if (err) throw err
      
      let replies = new Replies()
      replies.reply = req.body.reply
      replies.parent = gambitInserted._id
      let result2 = replies.save(function(err,replyInserted) {
          if (err) throw err
          //console.log('replyInserted == ',replyInserted._id)

          Gambits.update({ _id:gambitInserted._id }, { replies : replyInserted._id.toString() }, { multi: true }, function(err, res) {
            if (err) throw err
          });
      })

      let topics = new Topics()
      topics.gambits = gambitInserted._id.toString();
      topics.save(function(err,topicInserted) {
          if (err) throw err
          //res.send("Date saved to chatbot collection.");
          res.redirect('/admin')
      })
  })
});
// admin end


const options = {
  factSystem: {
    clean: true
  },
  importFile: './data.json',
  mongoURI: 'mongodb://localhost/superscriptDB'
};

superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  server.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`);
  });
});
