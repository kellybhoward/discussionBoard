var mongoose = require('mongoose');
//include necessary mongoose model to do the functions through
var Topic = mongoose.model('Topic');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
module.exports = {
    addComment: function(req, res){
        console.log(req.body.comment.text + req.body.user.name + req.body.post._id);
        Post.findOne({_id: req.body.post._id}, function(err, post){
            var comment = new Comment({text: req.body.comment.text, _user: req.body.user, _post: req.body.post});
            console.log(comment);
            comment._post = post._id;
            post.comments.push(comment);
            comment.save(function(err){
                post.save(function(err){
                    if(err){
                        console.log('something wrong add comment');
                    } else{
                        console.log('success adding comment');
                        res.redirect('/');
                    }
                });
            })
        })
    }
}
