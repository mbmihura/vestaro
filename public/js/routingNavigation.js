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
        angular.forEach(items, function ( item ) {
            if ( item.price >= minPrice && item.price <= maxPrice ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
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

function ItemSearchCtrl($scope, $http) {
  $http.get('/items').success(function(data){
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