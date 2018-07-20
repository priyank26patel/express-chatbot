import superscript from 'superscript';
import express from 'express';
import bodyParser from 'body-parser';

const server = express();
const PORT = process.env.PORT || 5000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'))

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

const options = {
  factSystem: {
    clean: true,
  },
  importFile: './data.json',
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
