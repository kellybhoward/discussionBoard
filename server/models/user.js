var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    name: String,
    topicCount: Number,
    postCount: Number,
    commentCount: Number
})
//validation paths for the attributes in the object
UserSchema.path('name').required(true, "Name cannot be blank");

var User = mongoose.model('User', UserSchema);
