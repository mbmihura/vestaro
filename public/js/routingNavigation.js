var vestaroMain = angular.module('vestaroMain', []);

vestaroMain.config(function($routeProvider) {
  var template = '<div ng-include="templateUrl">Loading...</div>';
  $routeProvider.
	  when('/', {controller:BuyerHomeCtrl, templateUrl:'assets/html/buyerHome.html'}).
	  when('/itemSearch', {controller:ItemSearchCtrl, templateUrl:'assets/html/itemSearch.html'}).
	  when('/dashboard', {controller:SellerDashboardCtrl, templateUrl:'assets/html/sellerDashboard.html'}).
	  when('/:serverPageUrl', {template: template, controller: 'serverPageRoutingCtrl'}).
	  otherwise({redirectTo:'/'});
})
.controller('serverPageRoutingCtrl', ['$scope', '$routeParams' ,function($scope, $routeParams){
	$scope.templateUrl = "/" + $routeParams.serverPageUrl;
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

vestaroMain.filter('priceBetween', function () {
	return function ( items, minPrice, maxPrice ) {
		var filteredItems = [];
		for (var i=0; i<items.length; i++){
            if ( items[i].price >= minPrice && items[0].price <= maxPrice ) {
                filteredItems.push(item);
            }
        }
		return filteredItems;
    }
});

vestaroMain.filter('inCategory', function(){
    return function(items, title){
        var filteredItems = [];
        for (var i=0; i<items.length; i++){
            if (items[i].title.toLowerCase().search(title.toLowerCase()) != -1) {
            	filteredItems.push(items[i]);
            }
        }
        return filteredItems;
    };
});

vestaroMain.factory('Items', function($http) {
	var Items = {};
    
    Items.categories = [ {name: 'Camisa', sexo: 'Mujer'},
	                     {name: 'Buzo', sexo: 'Hombre'}];
    
    Items.categories.push({name: '', sexo: ''});
    
	return Items;
});

function BuyerHomeCtrl($scope, $http) {
  $http.get('/items').success(function(data){
	  $scope.items = data;
  });
  
  $scope.container = $('#itemsContainer');
  
//  $scope.container.imagesLoaded( function(){
//	  $scope.container.isotope({
//		itemSelector: '.item',
//		getSortData : {
//	        type : function( $elem ) {
//	          return $elem.attr('data-type');
//	        },
//	        price : function( $elem ) {
//	          return parseFloat( $elem.find('.price').text().replace('$','') );
//	        },
//	        title : function ( $elem ) {
//	          return $elem.find('.title').text();
//	        }
//	    }
//	  });
//   });
}

function ItemSearchCtrl($scope, $http, Items) {
  
  $scope.categories = Items.categories;
  
  $http.get('/items').success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showBuyModal = function(item){
	  $('#buyModal').modal('show');
	  $scope.item = item;
  }
  
  $scope.addToWishlist = function(item){
	  console.log("TODO: Add to wishlist: " + item.title);
  }
}
 
function SellerDashboardCtrl($scope) {
}