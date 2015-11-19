var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var PostSchema = new mongoose.Schema({
    text: String,
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    _topic: {type: Schema.Types.ObjectId, ref: 'Topic'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    up: Number,
    down: Number,
    createdAt: {type: Date, default: new Date}
})
//validation paths for the attributes in the object
PostSchema.path('text').required(true, "Text cannot be blank");
PostSchema.plugin(deepPopulate);

var Post = mongoose.model('Post', PostSchema);
