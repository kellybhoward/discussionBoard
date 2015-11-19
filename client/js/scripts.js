//Set up a new angular module, name it, and inject router
var myAppModule = angular.module('boardApp', ['ngRoute']);
moment().format();

//Set title dynamically for each partial page
myAppModule.run(function($rootScope){
    $rootScope.$on("$routeChangeSuccess", function(event, currentRoute, previousRoute){
        $rootScope.title = currentRoute.title;
    });
    $rootScope.loggedIn = false;
    $rootScope.userName = "";
})

//Set up Routes with dynamic titles
myAppModule.config(function($routeProvider){
    $routeProvider
    .when('/',{
        title: "Login and Registration",
        templateUrl: '/partials/login.html'
    })
    .when('/dashboard',{
        title: "Main Dashboard",
        templateUrl: '/partials/dashboard.html'
    })
    .when('/topic',{
        title: "Topic",
        templateUrl: '/partials/topic.html'
    })
    .when('/profile',{
        title: "User Profile",
        templateUrl: '/partials/profile.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});

//Set up Login
myAppModule.controller('LoginController',['$scope', '$rootScope','LoginFactory', '$location', function($scope, $rootScope, LoginFactory, $location){
    console.log('got to login controller!');
    if($rootScope.loggedIn == true){
        return $location.path('/dashboard');
    }
    $scope.users = [];
    $scope.credentials = {};
    $scope.credentials.newName = "";
    $scope.credentials.name = "";
    $scope.errMessage = "";
    console.log(errMessage);
    if(!errMessage){var errMessage = "Please enter your username to join and share your ideas";}
    $scope.errMessage = errMessage;
    $scope.$watch("errMessage", function(newValue, oldValue) {
           return errMessage;
   })
    LoginFactory.getUsers(function(data){
        $scope.users = data;
        // console.log("got users, first one: "+ $scope.users[0].name);
    })
    $scope.login = function(){
        if($scope.credentials.newName == "" && $scope.credentials.name == ""){
            console.log('inputs were both blank');
            errMessage = "Please enter your username to join and share your ideas";
            $scope.errMessage = errMessage;
            console.log($scope.errMessage);
            return $location.path();
        }
        else{
            console.log("newName: " + $scope.credentials.newName + " name: " + $scope.credentials.name);
            console.log($scope.users);
            for(var i = 0; i < $scope.users.length; i++){
                console.log('made it to for loop');
                if($scope.credentials.newName == $scope.users[i].name){
                    errMessage = "We already have that user!";
                    $scope.errMessage = errMessage;
                    console.log($scope.errMessage);
                    $scope.credentials.newName = "";
                    $scope.credentials.name = "";
                    return $location.path();
                }
            }
            if($scope.credentials.name.length > 0){
                var user = {name: $scope.credentials.name};
                for(var i = 0; i < $scope.users.length; i++){
                    if(user.name == $scope.users[i].name){
                        $rootScope.loggedIn = true;
                        console.log($rootScope.loggedIn);

                        $rootScope.userName = user.name;
                        return $location.path("/dashboard");
                    }
                }
                errMessage = "That user doesn't exist in our DB!";
                $scope.errMessage = errMessage;
                console.log($scope.errMessage);
                $scope.credentials.newName = "";
                $scope.credentials.name = "";
                return $location.path();
            }
            else{
                console.log('got to the last check');
                var user = {name: $scope.credentials.newName};
                console.log(user);
                $rootScope.loggedIn = true;
                console.log($rootScope.loggedIn);
                $rootScope.userName = user.name;
                LoginFactory.addUser(user, function(){
                    console.log('successful add');
                    $location.path('/dashboard');
                });
            }
        }
    }

}]);

myAppModule.factory('LoginFactory', function($http){
    var factory = {};
    var users = [];
    factory.getUsers = function(callback){
        $http.get('/users').success(function(output){
            users = output;
            callback(users);
        })
    }
    factory.addUser = function(user, callback){
        $http.post('/users/add', user).success(function(){
            callback();
        })
    }
    return factory;
})

//Set up Dashboard
myAppModule.controller('DashboardController',['$scope', '$rootScope', 'DashboardFactory', '$location', function($scope, $rootScope, DashboardFactory, $location){
    //logged in checks and logout
    if($rootScope.loggedIn == false){
        console.log('user not logged in');
        return $location.path('/');
    }
    $scope.logout = function(){
        $rootScope.loggedIn = false;
        $rootScope.userName = "";
        return $location.path('/');
    }

    console.log($rootScope.loggedIn);
    console.log('using dashboard controller');

    $scope.topics = [];
    DashboardFactory.getTopics(function(data){
        $scope.topics = data;
    })
    $scope.addTopic = function(){
        console.log($scope.newTopic);
        var user = {name: $rootScope.userName};
        DashboardFactory.getUser(user, function(data){
            var totalTopic = {user: data[0], topic: $scope.newTopic};
            console.log(totalTopic);
            DashboardFactory.addTopic(totalTopic, function(){
                DashboardFactory.increaseTopicCount(totalTopic.user, function(){
                    DashboardFactory.getTopics(function(data){
                        $scope.topics = data;
                        $scope.newTopic = {};
                    });
                })
            })
        })
    }

    //re routing with ng-clicks and the ids of things
    $scope.goToProfile = function(id){
        $rootScope.profileId = id;
        console.log($scope.profileId);
        return $location.path('/profile');
    }
    $scope.goToTopic = function(id){
        $rootScope.topicId = id;
        console.log($scope.topicId);
        return $location.path('/topic');
    }
}])

myAppModule.factory('DashboardFactory', function($http){
    var factory = {};
    var topics = [];
    factory.getTopics = function(callback){
        $http.get('/topics').success(function(output){
            topics = output;
            callback(topics);
        })
    }
    factory.getUser = function(user, callback){
        console.log('made it to dash factory to get user');
        console.log('this is the user: '+user.name);
        $http.post('/users/getUser', user).success(function(data){
            callback(data);
        })
    }
    factory.addTopic = function(totalTopic, callback){
        $http.post('/topics/add', totalTopic).success(function(){
            callback();
        })
    }
    factory.increaseTopicCount = function(user, callback){
        $http.post('/users/increaseTopicCount', user).success(function(){
            callback()
        })
    }
    return factory;
})

//Set up Topic Page
myAppModule.controller('TopicController',['$scope', '$rootScope', 'TopicFactory', '$location', function($scope, $rootScope, TopicFactory, $location){
    if($rootScope.loggedIn == false){
        console.log('user not logged in');
        return $location.path('/');
    }
    $scope.logout = function(){
        $rootScope.loggedIn = false;
        $rootScope.userName = "";
        return $location.path('/');
    }

    console.log($rootScope.loggedIn);
    console.log('using topic controller');
    console.log($scope.topicId);

    $scope.topic;
    var topicId = {id: $scope.topicId};
    TopicFactory.getTopic(topicId, function(data){
        console.log(data);
        return $scope.topic = data;
    })

    $scope.newPost = {};
    $scope.addPost = function(){
        console.log($scope.newPost);
        var user = {name: $rootScope.userName};
        TopicFactory.getUser(user, function(user){
            var topicId = {id: $scope.topicId};
            TopicFactory.getTopic(topicId, function(topic){
                var totalPost = {user: user[0], topic: topic, post: $scope.newPost};
                console.log(totalPost);
                TopicFactory.addPost(totalPost, function(){
                    TopicFactory.increasePostCount(totalPost.user, function(){
                        TopicFactory.getTopic(topicId, function(data){
                            $scope.topic = data;
                            $scope.newPost = {};
                        });
                    })
                })
            })
        })
    }
    $scope.newComment = {};
    $scope.addComment = function(post_id, index){
        console.log($scope.newComment[index]);
        var user = {name: $rootScope.userName};
        TopicFactory.getUser(user, function(user){
            var postId = {id: post_id};
            TopicFactory.getPost(postId, function(post){
                var totalComment = {user: user[0], post: post, comment: $scope.newComment[index]};
                console.log(totalComment);
                TopicFactory.addComment(totalComment, function(){
                    TopicFactory.increaseCommentCount(totalComment.user, function(){
                        TopicFactory.getTopic(topicId, function(data){
                            $scope.topic = data;
                            $scope.newComment = {};
                        });
                    })
                })
            })
        })
    }
    $scope.addUp = function(post_id){
        var postId = {id: post_id};
        console.log(postId);
        TopicFactory.increaseUps(postId, function(){
            TopicFactory.getTopic(topicId, function(data){
                $scope.topic = data;
                $scope.newComment = {};
            });
        })
    }
    $scope.addDown = function(post_id){
        var postId = {id: post_id};
        TopicFactory.increaseDowns(postId, function(){
            TopicFactory.getTopic(topicId, function(data){
                $scope.topic = data;
                $scope.newComment = {};
            });
        })
    }
    $scope.goToProfile = function(id){
        $rootScope.profileId = id;
        console.log($scope.profileId);
        return $location.path('/profile');
    }
}])

myAppModule.factory('TopicFactory', function($http){
    var factory = {};
    var topic = [];
    factory.getTopic = function(topicId, callback){
        $http.post('/topics/'+topicId.id).success(function(data){
            topic = data;
            callback(topic);
        })
    }
    factory.getUser = function(user, callback){
        console.log('made it to topic factory to get user');
        console.log('this is the user: '+user.name);
        $http.post('/users/getUser', user).success(function(data){
            callback(data);
        })
    }
    factory.getPost = function(postId, callback){
        console.log('made it to topic factory to get post');
        $http.post('/posts/'+postId.id).success(function(data){
            callback(data);
        })
    }
    factory.addPost = function(totalPost, callback){
        $http.post('/posts/add', totalPost).success(function(){
            callback();
        })
    }
    factory.addComment = function(totalComment, callback){
        $http.post('/comments/add', totalComment).success(function(){
            callback();
        })
    }
    factory.increasePostCount = function(user, callback){
        $http.post('/users/increasePostCount', user).success(function(){
            callback()
        })
    }
    factory.increaseCommentCount = function(user, callback){
        $http.post('/users/increaseCommentCount', user).success(function(){
            callback()
        })
    }
    factory.increaseUps = function(postId, callback){
        $http.post('/posts/increaseUps', postId).success(function(){
            callback()
        })
    }
    factory.increaseDowns = function(postId, callback){
        $http.post('/posts/increaseDowns', postId).success(function(){
            callback()
        })
    }
    return factory;
})

//Set up Profile Page
myAppModule.controller('ProfileController',['$scope', '$rootScope', 'ProfileFactory', '$location', '$routeParams',function($scope, $rootScope, ProfileFactory, $location, $routeParams){
    if($rootScope.loggedIn == false){
        console.log('user not logged in');
        return $location.path('/');
    }
    $scope.logout = function(){
        $rootScope.loggedIn = false;
        $rootScope.userName = "";
        $rootScope.profileId = null;
        return $location.path('/');
    }
    console.log($rootScope.loggedIn);
    console.log('using profile controller');
    console.log($rootScope.profileId);
    $scope.profile;
    var profileId = {id: $rootScope.profileId};
    ProfileFactory.getProfile(profileId, function(data){
        console.log(data);
        $scope.profile = data[0];
    })
    console.log($scope.profile);
}])

myAppModule.factory('ProfileFactory', function($http){
    var factory = {};
    var profile;
    factory.getProfile = function(profileId, callback){
        $http.post('/users/'+profileId.id).success(function(data){
            profile = data;
            callback(profile);
        })
    }
    return factory;
})
