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
    $scope.list = $.grep($scope.list,function(g){ return g.id != id;});
  };
	
}])

.controller('GarmentListCCtrl', ['$scope','$http', function($scope, $http){
  	$http.get('/garment').success(function(list) {
		$scope.list = list;
	});;
}])

.controller('GarmentNewCtrl', ['$scope', function($scope){

  /* size table methods */
  $scope.removeSize = function(index)
  {
    $scope.garment.stock.splice(index, 1);
  };
  $scope.addSize = function()
  {
    $scope.garment.stock.push({id: "", size:"", quantity: 0});
  };

  $scope.save = function() {
    //TODO:
  }
}])

.controller('GarmentEditCtrl', ['$scope', 'garmentsApi', '$routeParams', '$location', function($scope, garmentsApi, $routeParams, $location){
  $scope.garment = garmentsApi.get({id: $routeParams.id}, function(){
    $scope.garment.imgUrlNew = $scope.garment.imgUrl;
  });

  $scope.updateImgUrlSave = function()
  {
    $scope.garment.imgUrl = $scope.garment.imgUrlNew;
  };
  $scope.updateImgUrlCancel = function()
  {
    $scope.garment.imgUrlNew = $scope.garment.imgUrl;
  };
  
  /* size table methods */
  $scope.removeSize = function(index)
  {
    $scope.garment.stock.splice(index, 1);
  };
  $scope.addSize = function()
  {
    $scope.garment.stock.push({id: "", size:"", quantity: 0});
  };

  $scope.save = function() {
    garmentsApi.save({},$scope.garment,
      //success
      function( value ){$location.path('/garments');},
      //error
      function( error ){
      /*TODO: Do something with error*/}
   );
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
