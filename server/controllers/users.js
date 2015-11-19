var mongoose = require('mongoose');
//include necessary mongoose model to do the functions through
var User = mongoose.model('User');
module.exports = {
    show: function(req,res){
        User.find({}, function(err, users){
            if(err){
                console.log('something went wrong');
            } else{
                console.log('getting users!');
                res.json(users);
            }
        })
    },
    showOne: function(req, res){
        User.find({_id: req.params.id}, function(err, profile){
            if(err){
                console.log('something went wrong and i am in the showOne function');
            } else{
                console.log('getting a profile!');
                console.log(profile);
                res.json(profile);
            }
        })
    },
    getUser: function(req, res){
        User.find({name: req.body.name}, function(err, user){
            console.log(req.body.name)
            if(err){
                console.log('something went wrong with getting user');
            } else{
                console.log('getting a user!');
                console.log(user);
                res.json(user);
            }
        })
    },
    addUser: function(req, res) {
        console.log(req.body.name);
        var user = new User({name: req.body.name, topicCount: 0, postCount: 0, commentCount: 0});
        user.save(function(err){
            if(err){
                console.log('something went wrong');
            } else{
                console.log('successfully added user!');
                res.redirect('/');
            }
        })
    },
    increaseTopicCount: function(req, res){
        console.log('made it to increaseTopicCount');
        var conditions = {name: req.body.name}, update = {$inc: {topicCount: 1}}, options = {multi: false};
        User.update(conditions, update, options, callback);
        function callback(err, user){
            if(err){
                console.log("increasing topic didn't work");
            }
            else{
                console.log('increased topic count for ' + req.body.name);
                res.redirect('/');
            }
        }
    },
    increasePostCount: function(req, res){
        console.log('made it to increasePostCount');
        var conditions = {name: req.body.name}, update = {$inc: {postCount: 1}}, options = {multi: false};
        User.update(conditions, update, options, callback);
        function callback(err, user){
            if(err){
                console.log("increasing post didn't work");
            }
            else{
                console.log('increased post count for ' + req.body.name);
                res.redirect('/');
            }
        }
    },
    increaseCommentCount: function(req, res){
        console.log('made it to increaseCommentCount');
        var conditions = {name: req.body.name}, update = {$inc: {commentCount: 1}}, options = {multi: false};
        User.update(conditions, update, options, callback);
        function callback(err, user){
            if(err){
                console.log("increasing comment didn't work");
            }
            else{
                console.log('increased comment count for ' + req.body.name);
                res.redirect('/');
            }
        }
    }
}
