var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var TopicSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    createdAt: {type: Date, default: new Date}
})
//validation paths for the attributes in the object
TopicSchema.path('title').required(true, "Topic cannot be blank");
TopicSchema.path('description').required(true, "Description cannot be blank");
TopicSchema.path('category').required(true, "Category cannot be blank");
TopicSchema.plugin(deepPopulate);

var Topic = mongoose.model('Topic', TopicSchema);
