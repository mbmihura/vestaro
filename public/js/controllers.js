'use strict';

/* Controllers */
vestaroMain.

controller('serverPageRoutingCtrl', ['$scope', '$routeParams', '$location',function($scope, $routeParams, $location){
  $scope.templateUrl = $location.$$url;
}])

.controller('GarmentListCtrl', ['$scope','garmentsApi', function($scope, garmentsApi){
  $scope.list = garmentsApi.query({ownerUser: 'currentUser'});

  $scope.setToDelete = function(id, title){
    // TODO: retrieve from list;
    $scope.toDelete = { id: id, title: title};
  };

  $scope.destroy = function(id)
  {
    garmentsApi.delete({id: id});
    $scope.list = $.grep($scope.list,function(i){ return i.id != id;});
  };
	
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

.controller('GarmentEditCtrl', ['$scope', 'garmentsApi', '$routeParams', '$location', function($scope, garmentsApi, $routeParams, $location){
  $scope.garment = garmentsApi.get({id: $routeParams.id})
  
  // TODO check if item has change and if so, enable save button.
  $scope.hasChanged = function() {
    return !angular.equals($scope.remote, $scope.project);
  }
    
  $scope.save = function() {
    garmentsApi.save($scope.garment, function(r)
      {
        $scope.cancel();
      });
  };

  $scope.cancel = function() {
      $location.path('/garments');
  };

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
