var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var fs = require('fs');
var path = require('path');
//include the name of the mongoDB for the application
mongoose.connect('mongodb://localhost/boardDB');
var models_path = path.join(__dirname, './../models');
fs.readdirSync(models_path).forEach(function(file){
    if(file.indexOf('.js') >= 0){
        require(models_path + '/' + file);
    }
})
