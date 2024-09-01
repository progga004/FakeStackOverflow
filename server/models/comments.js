const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    commentableId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Question', 'Answer']
    }
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
