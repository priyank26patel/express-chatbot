import superscript from 'superscript';
import express from 'express';
import bodyParser from 'body-parser';
var mongoose = require("mongoose");

const server = express();
const PORT = process.env.PORT || 5000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'))

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Test", { useNewUrlParser: true });

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
