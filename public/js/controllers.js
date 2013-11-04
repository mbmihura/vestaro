'use strict';

/* Controllers */
vestaroMain.

controller('serverPageRoutingCtrl', ['$scope', '$routeParams', '$location',function($scope, $routeParams, $location){
  $scope.templateUrl = $location.$$url;
}])

.controller('GarmentListCtrl', ['$scope','$http', function($scope, $http){
  	$http.get('/garment').success(function(list) {
		$scope.list = list;
	});;
}])

.controller('GarmentListCCtrl', ['$scope','$http', function($scope, $http){
  	$http.get('/garment').success(function(list) {
		$scope.list = list;
	});;
}])

.controller('GarmentNewCtrl', ['$scope', function($scope){
  $scope.save = function() {
    //TODO:
  }
}])

.controller('GarmentEditCtrl', ['$scope', function($scope){
  
}])

.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.views = [
      {path: '/', title: 'Inicio', icon: 'home'},
      {path: '/wishlist', title: 'Wishlist', icon: 'star'},
      {path: '/buyerProfile', title: 'Perfil', icon: 'user'},
      {path: '/itemSearch', title: 'Prendas', icon: 'th'}];
	  
    $scope.isActive = function(view) {
      if (view.path == $location.path()) {
        return true;
      }
      return false;
    };
    
}]);


function SellerDashboardCtrl($scope){}
function CollectionsCtrl(){}
function SelletSettingsCtrl(){}