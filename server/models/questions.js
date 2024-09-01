// Question Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Question = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: true
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            required:true
        }
    ],
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer',
        }
    ],
    asked_by: {
        // type: String, //default value is missing
        // default: 'Anonymous',
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    ask_date_time: {
        type: Date,
        default: Date.now()
    },
    views: {
        type: Number,
        default:0
    },
    votes: {
        type: Number,
        default: 0,
    }

});

// Define a virtual property for the "url" field
Question.virtual('url').get(function () {
    return `/posts/question/${this._id}`;
});

// Create and export the Question model
module.exports = mongoose.model('Question', Question);
