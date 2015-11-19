var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var CommentSchema = new mongoose.Schema({
    text: String,
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    _post: {type: Schema.Types.ObjectId, ref: 'Post'},
    createdAt: {type: Date, default: new Date}
})
//validation paths for the attributes in the object
CommentSchema.path('text').required(true, "Text cannot be blank");
CommentSchema.plugin(deepPopulate);

var Comment = mongoose.model('Comment', CommentSchema);
