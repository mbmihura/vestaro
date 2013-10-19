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

/* Filtros */
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
}).filter('inCategory', function(){
    return function(items, category){
        if(category == 'Todas') return items;
    	var filteredItems = [];
        for (var i=0; i<items.length; i++){
            if (items[i].title.toLowerCase().search(category.toLowerCase()) != -1) {
            	filteredItems.push(items[i]);
            }
        }
        return filteredItems;
    };
})

/* Data Factory */
vestaroMain.factory('Items', function($http) {
	var Items = {};
    
    Items.categories = [ {name: 'Todas', sexo: 'Todos'},
                         {name: 'Camisa', sexo: 'Mujer'},
	                     {name: 'Buzo', sexo: 'Hombre'}];
    
	return Items;
});

/* Controllers */
function BuyerHomeCtrl($scope, $http) {
  $http.get('/items').success(function(data){
	  $scope.items = data;
  });
  
  //TODO: call to easyrec most viewed
  $http.get('/items').success(function(data){
	  $scope.popularItems = data;
  });
  
//  $scope.$on('$viewContentLoaded', function(){
//	var $container = $('#itemsContainer');
//	var options = {
//		itemSelector : '.item',
//		getSortData : {
//			type : function($elem) {
//				return $elem.attr('data-type');
//			},
//			price : function($elem) {
//				return parseFloat($elem.find('.price').text().replace('$', ''));
//			},
//			title : function($elem) {
//				return $elem.find('.title').text();
//			}
//		}
//	};
//	$container.imagesLoaded( function(){
//	  $container.isotope(options);
//   });
//  });
  
}

var jqueryItemSearch = function(){
	tooltipOptions = {animation: true,
		placement: 'top',
		delay: {show: 800, hide: 200}};
	$('.has-tooltip').tooltip(tooltipOptions);
	$('.item-container').on('mouseenter mouseleave', function(){
		$(this).find('.item-actions').slideToggle();
	});
}

function ItemSearchCtrl($scope, $http, Items) {
  
  $scope.categories = Items.categories;
  
  $http.get('/items').success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showItemModal = function(item){
	  $scope.item = item;
	  $('#itemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  console.log("TODO: Add to wishlist: " + item.title);
  }
  
  $scope.$on('$viewContentLoaded', jqueryItemSearch);
  
}
 
function SellerDashboardCtrl($scope) {
	
}