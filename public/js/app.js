var app = angular.module('sampleApp', []);

app.config(function ($httpProvider) {
  $httpProvider.defaults.transformRequest = function(data){
    if (data === undefined) {
        return data;
    }
    return $.param(data);
  }
});

app.controller('MainCtrl', function($scope, $http) {
  $scope.getMovie = function (search) {
    $http.get("https://www.omdbapi.com/?s=" + search).success(function(data) {
      $scope.items = data.Search;
      $scope.searched = true;
      console.log($scope.items);
    });
  };

  // view individual item from search
  $scope.hiddenDiv = false;
  $scope.showDiv = function () {
    $scope.hiddenDiv = !$scope.hiddenDiv;
  };

  // view favorites
  $scope.getFavorites = function() {
  	$http.get("https://shrouded-cliffs-32402.herokuapp.com/favorites").success(function(data) {
  		$scope.favorites = data;
  	})
  };

  // add item to favorites list
  $scope.addToFavorites = function(item) {
  	$http({
			withCredentials: false,
			method: 'POST',
			url: 'https://shrouded-cliffs-32402.herokuapp.com/favorites',
			headers: {
   			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
 			},
			data: { name: item.Title, oid: item.imdbID }
  	}).then(function(response) {
  		console.log("made post");
  		console.log(response);
  		$scope.getFavorites();
  	}, function(error) {
  		console.log("post failed");
  		console.log(error);
  	});
  };
});