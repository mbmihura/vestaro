'use strict';

/* Controllers */
vestaroMain.

controller('serverPageRoutingCtrl', ['$scope', '$routeParams', '$location', '$route', '$compile', '$http',
  function($scope, $routeParams, $location, $route, $compile, $http){
  $route.current.templateUrl = $location.$$url;
  $http.get($route.current.templateUrl).then(function (msg) {
    $('#views').html($compile(msg.data)($scope));
  });
}])

.controller('GarmentListCtrl', ['$scope','garmentsApi', function($scope, garmentsApi){
  $scope.list = garmentsApi.query({ownerUser: 'currentUser'}, function(data){
    $scope.list.forEach(function(i){
      i.totalStock = $scope.totalSizeSum(i.stock)
    });
  });



  $scope.setToDelete = function(id, title){
    // TODO: retrieve from list;
    $scope.toDelete = { id: id, title: title};
  };

  $scope.totalSizeSum = function(stocks)
  {
    var total = 0;
    stocks.forEach(function(s){
      total = total + s.quantity;
    });
    return total;
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

.controller('GarmentViewCtrl', ['$scope', 'garmentsApi', '$routeParams', '$location', '$http','Easyrec', 'Facebook', 'BuyerSession',
  function($scope, garmentsApi, $routeParams, $location, $http, Easyrec, Facebook, BuyerSession){
  $scope.garment = garmentsApi.get({id: $routeParams.id}, function() {
    $scope.garment.availableStocks = "";
    $scope.garment.stock.forEach(function(s) {
      if(s.quantity > 0)
        $scope.garment.availableStocks += s.size + ", ";
    });

    $scope.garment.availableStocks = $scope.garment.availableStocks.substring(0, $scope.garment.availableStocks.length - 2); 
    $http.post('/garment/' + $routeParams.id + '/actions', {type:'VIEW'});
    $scope.garment.availableStocks = $scope.garment.availableStocks.substring(0, $scope.garment.availableStocks.length - 2);
    
    Easyrec.sendAction('view', $scope.garment);

    $scope.shareItem = function(){
      Facebook.feedDialog($scope.garment);
    }

    $scope.addToWishlist = function(){
      BuyerSession.addToWishlist($scope.garment);
    }
});


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
    
}])

.controller('SellerDetailsCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $http.get('/seller/' + $routeParams.id)
      .success(function(response){
        $scope.seller = response;
      })
      .error(function(response){
        console.log(response);
      });
}])

.controller('NullCtrl', [function (){}]);
