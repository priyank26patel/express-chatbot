var mongoose = require('mongoose');

//admin start
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
  replies: [],
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
  id: String
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
  id: String
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
  }
});
let Topics = mongoose.model("ss_topics", topicSchema);
//admin end

module.exports = mongoose.model("ss_gambits", gambitSchema);

// module.exports.gambits = mongoose.model("ss_gambits", gambitSchema);
// module.exports.replies = mongoose.model("ss_replies", replySchema);
// module.exports.topics = mongoose.model("ss_topics", topicSchema);