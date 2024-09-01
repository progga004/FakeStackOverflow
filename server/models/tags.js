// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tags = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Define a virtual property for the "url" field
Tags.virtual('url').get(function () {
    return `/posts/tag/${this._id}`;
}
);

// Create and export the Tag model
module.exports = mongoose.model('Tag', Tags);
