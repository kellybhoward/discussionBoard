var mongoose = require('mongoose');
//include necessary mongoose model to do the functions through
var Topic = mongoose.model('Topic');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
module.exports = {
    show: function(req,res){
        Topic.find({}).populate('_user').exec(function(err, topics){
            if(err){
                console.log('something went wrong with showing topics');
            } else{
                console.log('getting topics!');
                res.json(topics);
            }
        })
    },
    showOne: function(req, res){
        Topic.findById(req.params.id).deepPopulate(['_user', 'posts', 'posts._user', 'posts.comments', 'posts.comments._user']).exec(function(err, topic){
            if(err){
                console.log('something went wrong getting the deeply populated topic');
            }
            else{
                console.log('success in getting deep topic!');
                console.log(topic);
                res.json(topic);
            }
        })
    },
    addTopic: function(req, res) {
        console.log(req.body.topic.title + req.body.topic.description + req.body.topic.category);
        var topic = new Topic({title: req.body.topic.title, description: req.body.topic.description, category: req.body.topic.category, _user: req.body.user});
        console.log(topic);
        topic.save(function(err){
            if(err){
                console.log('something went wrong with adding a topic');
            } else{
                console.log('successfully added topic!');
                res.redirect('/');
            }
        })
    }
}
