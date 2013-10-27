var vestaroMain = angular.module('vestaroMain', []);

vestaroMain.config(function($routeProvider) {
  var template = '<div ng-include="templateUrl">Loading...</div>';
  $routeProvider.
	  when('/', {controller:BuyerHomeCtrl, templateUrl:'assets/html/buyer/buyerHome.html'}).
	  when('/itemSearch', {controller:ItemSearchCtrl, templateUrl:'assets/html/buyer/itemSearch.html'}).
	  when('/wishlist', {controller:WishlistCtrl, templateUrl:'assets/html/buyer/wishlist.html'}).
	  when('/dashboard', {controller:SellerDashboardCtrl, templateUrl:'assets/html/dashboard.html'}).
	  when('/dashboardFull', {controller:SellerDashboardCtrl, templateUrl:'assets/html/dashboardFull.html'}).
	  when('/collections', {controller:CollectionsCtrl, templateUrl:'assets/html/collectionForm.html'}).
	  when('/sellerSettings', {controller:SelletSettingsCtrl, templateUrl:'assets/html/sellerSettings.html'}).	  

	  when('/garments', {controller:'GarmentListCtrl', templateUrl:'assets/html/garment/listCompact.html'}).
	  when('/garmentsComplete', {controller:'GarmentListCCtrl', templateUrl:'assets/html/garment/listDetailed.html'}).
	  when('/garments/new', {controller:'GarmentNewCtrl', templateUrl:'assets/html/garment/form.html'}).
	  when('/garments/:id', {controller:'GarmentEditCtrl', templateUrl:'assets/html/garment/form.html'}).

	  when('/:serverPageUrl', {template: template, controller: 'serverPageRoutingCtrl'}).
	  otherwise({redirectTo:'/'});
})


/* Filters */
vestaroMain.filter('priceBetween', function () {
    return function ( items, minPrice, maxPrice ) {
        var filteredItems = []
        angular.forEach(items, function ( item ) {
            if ( item.price >= minPrice && item.price <= maxPrice ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
}).filter('inCategory', function(){
    return function(items, category){
        if(category.id == 0) return items;
    	var filteredItems = [];
        angular.forEach(items, function ( item ) {
            if ( item.title.toLowerCase().search(category.name.toLowerCase()) != -1 ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    };
})

/* Directives */
vestaroMain.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
})

/* Data Factory */
vestaroMain.factory('buyerSession', function($http){
	return {
        getWishlist: function() {
            return $http.get('/wishlist');
        },
        getItems: function() {
        	return $http.get('/garment');
        },
        // TODO: replace with easyrec request.
        getPopularItems: function() {
        	return $http.get('/garment');
        },
        // TODO: replace with server request for categories.
        getCategories: function() {
        	return [ {id: 0, name: 'Todas', sexo: 'Todos'},
                     {id: 1, name: 'Camisa', sexo: 'Mujer'},
                     {id: 2, name: 'Campera', sexo: 'Hombre'}];
        },
        addToWishlist: function(itemId) {
        	return $http.post('/wishlist', {'itemId': itemId})
	        	.success(function(data){
				  console.log(data);
			  })
			  .error(function(data, status, headers, config){
				  console.log(status);
				  // 401: Unauthorized
				  if(status == 401) $('#loginBtn').popover('show');
			  });
        },
        removeFromWishlist: function(itemId) {
        	return $http.delete('/wishlist/' + itemId);
        }
    };
});