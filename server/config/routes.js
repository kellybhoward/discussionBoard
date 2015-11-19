var mongoose = require('mongoose');
//include all necessary controllers for all the server routes
var users = require('../controllers/users.js');
var topics = require('../controllers/topics.js');
var posts = require('../controllers/posts.js');
var comments = require('../controllers/comments.js');
module.exports = function(app){

    app.get('/users', function(req, res) {
        users.show(req, res)
    })
    app.post('/users/add', function(req, res) {
        users.addUser(req, res)
    })
    app.post('/users/getUser', function(req, res){
        console.log('made it to routes - getUser');
        users.getUser(req, res)
    })
    app.post('/users/increaseTopicCount', function(req, res){
        console.log('made it to routes for topic count');
        users.increaseTopicCount(req, res)
    })
    app.post('/users/increasePostCount', function(req, res){
        console.log('made it to routes for post count');
        users.increasePostCount(req, res)
    })
    app.post('/users/increaseCommentCount', function(req, res){
        console.log('made it to routes for comment count');
        users.increaseCommentCount(req, res)
    })
    app.post('/users/:id', function(req, res){
        users.showOne(req, res)
    })
    app.get('/topics', function(req, res) {
        topics.show(req, res)
    })
    app.post('/topics/add', function(req, res) {
        topics.addTopic(req, res)
    })
    app.post('/topics/:id', function(req, res){
        topics.showOne(req, res)
    })
    app.post('/posts/add', function(req, res){
        posts.addPost(req, res)
    })
    app.post('/posts/increaseUps', function(req, res){
        posts.increaseUps(req, res)
    })
    app.post('/posts/increaseDowns', function(req, res){
        posts.increaseDowns(req, res)
    })
    app.post('/posts/:id', function(req, res){
        posts.showOne(req, res)
    })
    app.post('/comments/add', function(req, res){
        comments.addComment(req, res)
    })
    // app.get('/turtles/new', function(req, res){
    //     res.render("new");
    // })

    // app.get('/turtles/edit/:id', function(req, res){
    //     turtles.editOne(req,res)
    // })
    //
    // app.post('/turtles/:id', function(req, res){
    //     turtles.editTurtle(req, res)
    // })
    // app.post('/turtles/destroy/:id', function(req,res){
    //     turtles.deleteTurtle(req, res);
    // })
}
