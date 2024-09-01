const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
},
  reputation: {
    type: Number,
    default: 0,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  
  votes: {
    type: Number,
    default: 0,
  },
  
  votedOn: [
    {
      itemId: mongoose.Schema.Types.ObjectId, // ID of the question or comment
      itemType: { type: String, enum: ['question','answer', 'comment'] }, // Type to distinguish between question and comment
      voteType: { type: String, enum: ['upvote', 'downvote'] } // 'upvote' or 'downvote'
    },
  ],
});
module.exports = mongoose.model("User", User);
