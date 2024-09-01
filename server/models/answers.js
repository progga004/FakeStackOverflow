// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Answer = new Schema({
   
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    ans_date: {
        type: Date,
        default: Date.now()
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
      votes: {
        type: Number,
        default: 0,
    }

});

// Define a virtual property for the "url" field
Answer.virtual('url').get(function () {
    return `/posts/answer/${this._id}`;
});

// Create and export the Answer model
module.exports = mongoose.model('Answer', Answer);
