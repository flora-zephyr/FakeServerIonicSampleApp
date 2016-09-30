// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//a modifier avec l'adresse Ip de votre ordinateur pour que cela fonctionne
//sur un appareil portable
var URL = "http://192.168.0.30:3000/";

angular.module('starter', ['ionic'])

.run(function($ionicPlatform, $rootScope) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	 	.state('home', { url: "/home", templateUrl: "templates/home.html", controller : 'AppCtrl'})
	 	.state('menu', { url: "/menu", templateUrl: "templates/menu.html", controller : 'AppCtrl'})
	 	.state('post', { url: "/post", templateUrl: "templates/post.html", controller : 'AppCtrl'})
	 	.state('post-update', { url: "/post-update/:id", templateUrl: "templates/update_post.html", controller : 'AppCtrl', params : {id : null}});
  	$urlRouterProvider.otherwise('/menu');
})

.controller('AppCtrl', function($http, $scope, $state, $rootScope, $stateParams){

	$scope.idpost = $stateParams.idpost;
	$rootScope.posts = [];
	$rootScope.comments = [];
	$rootScope.lepost = [];

	$scope.goToPosts = function() {
		$state.go('home');
	};

	function initPosts (){
		$http.get(URL +'posts').then(function(posts){
			$rootScope.posts = posts.data;
		});
	}
	//méthode GET pour afficher tous les posts
	$scope.showPosts = function() {
		initPosts ();
	};

	//méthode GET pour afficher tous les commentaires
	function initComs(){
		$http.get(URL +'comments').then(function(data){
			$rootScope.comments = data.data;
		});
	}

	$scope.showComments = function() {
		initComs();
	};

	//méthode POST, avec les infos passées en paramètres dans le ng-click
	$scope.postaPost = function(postTitle, postAuthor) {
		console.log( postTitle, postAuthor);
		$http.post(URL +'posts', {title : postTitle, author : postAuthor}).then(function(data){
			$state.go('home');
			window.location.reload();
		});
	};

	//Pour voir les commentaires liés à l'id d'un post en particulier =
	//Méthode POST 'avancée'
	$scope.seeComments = function(comId) {
		var id = comId;
		var url = URL + id+"/comments";
		$http.get(url).then(function(data){
			$scope.commentsfrompost = data.data;
		});
	};

	//Méthode delete avec l'id du post à détruire
	$scope.deletePost = function(idpost){
		$http.delete(URL +"posts/" + idpost+"");
		$state.go('home');
		window.location.reload();
	};

	$scope.goToPost = function (postID) {
		var id = postID;
		$http.get(URL +'posts/' + id).then(function(post){
			$rootScope.lepost = post.data;
		});
		initComs();
		console.log($rootScope.lepost);
		$state.go('post');
	};

	$scope.goToUpdatePost = function(postID){
		var id = postID;
		console.log(id);
		$http.get(URL +'posts/' + id).then(function(post){
			$rootScope.lepost = post.data;
		});
		$state.go('post-update', {id :id});
	};

	//permet d'update un post en prenant ses paramètres depuis le ng-click jusqu'à la requête
	$scope.updatePost = function(postId, postTitle, postAuthor,postContent){
		var id = postId;
		$http.patch(URL +'posts/' + id , {title : postTitle, author : postAuthor, content : postContent})
		.success(function (data, status, headers, config) {
			console.log("ok");
			$state.go("home");
			window.location.reload();
            })
            .error(function (data, status, header, config) {
            });

	};
});
