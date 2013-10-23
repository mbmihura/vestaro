var vestaroMain = angular.module('vestaroMain', []);

vestaroMain.config(function($routeProvider) {
  var template = '<div ng-include="templateUrl">Loading...</div>';
  $routeProvider.
	  when('/', {controller:BuyerHomeCtrl, templateUrl:'assets/html/buyerHome.html'}).
	  when('/itemSearch', {controller:ItemSearchCtrl, templateUrl:'assets/html/itemSearch.html'}).
	  when('/dashboard', {controller:SellerDashboardCtrl, templateUrl:'assets/html/sellerDashboard.html'}).
	  when('/wishlist', {controller:WishlistCtrl, templateUrl:'assets/html/wishlist.html'}).
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
        	return $http.get('/items');
        },
        getPopularItems: function() {
        	return $http.get('/items');
        },
        getCategories: function() {
        	return [ {id: 0, name: 'Todas', sexo: 'Todos'},
                     {id: 1, name: 'Camisa', sexo: 'Mujer'},
                     {id: 2, name: 'Buzo', sexo: 'Hombre'}];
        },
        addToWishlist: function(itemId) {
        	return $http.post('/wishlist', {'itemId': itemId});
        },
        removeFromWishlist: function(itemId) {
        	return $http.delete('/wishlist/' + itemId);
        }
    };
});

/* Controllers */
function BuyerHomeCtrl($scope, buyerSession) {
  buyerSession.getItems().success(function(data){
	  $scope.items = data;
  });
  
  buyerSession.getPopularItems().success(function(data){
	  $scope.popularItems = data;
  });
  
  $scope.$on('isotope', isotopeHandling);
  
}

var isotopeHandling = function(ngRepeatFinishedEvent) {
	var $container = $('#itemsContainer');
	var options = {
		itemSelector : '.item',
		getSortData : {
			category : function($elem) {
				return $elem.attr('data-category');
			},
			price : function($elem) {
				return parseFloat($elem.find('.price').text().replace('$', ''));
			},
			title : function($elem) {
				return $elem.find('.title').text();
			}
		}
	};
	
	// Wait until all images are loaded
	$container.imagesLoaded(function() {
		$container.isotope(options);
	});
	
	var $optionSets = $('#itemsControls .option-set'),
	$optionLinks = $optionSets.find('.option');
	
	// Filters and ordering
	$optionLinks.click(function(){
		var $this = $(this);
		// don't proceed if already selected
		if ( $this.hasClass('selected') ) {
		  return false;
		}
		var $optionSet = $this.parents('.option-set');
		$optionSet.find('.selected').removeClass('selected').removeClass('active');
		$this.addClass('selected').addClass('active');
		
		// make option object dynamically, i.e. { filter: '.my-filter-class' }
		var options = {},
		    key = $optionSet.attr('data-option-key'),
		    value = $this.attr('data-option-value');
		// parse 'false' as false boolean
		value = value === 'false' ? false : value;
		options[ key ] = value;
		if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
		  // changes in layout modes need extra logic
		  changeLayoutMode( $this, options )
		} else {
		  // otherwise, apply new options
		  $container.isotope( options );
		}
		
		return false;
	});
	
	// Toggles item size
	$container.on('click', '.item', function() {
		if ($(this).hasClass('large')) {
			$(this).removeClass('large');
		} else {
			$container.find('.item.large').removeClass('large');
			$(this).addClass('large');
		}
		$container.isotope('reLayout');
	});

	// Toggles item information
	$container.on('.item', 'mouseenter mouseleave', function(e) {
		e.preventDefault();
		$(this).find('.itemInformation').fadeToggle('fast');
	});
	
}

function ItemSearchCtrl($scope, buyerSession) {
  
  $scope.categories = buyerSession.getCategories();
//  $scope.selectedCategory = $scope.categories[0];
  
  buyerSession.getItems().success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showItemModal = function(item){
	  $scope.item = item;
	  $('#itemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  buyerSession.addToWishlist(item.id)
		  .success(function(data){
			  console.log(data);
		  })
		  .error(function(data, status, headers, config){
			  console.log(status);
			  // 401: Unauthorized
			  if(status == 401) $('#loginBtn').popover('show');
		  });
  }
  
}

function WishlistCtrl($scope, buyerSession, $http) {

	buyerSession.getWishlist().success(function(data) {
		$scope.wishlistItems = data;
	});
	
	$scope.removeFromWishlist = function(wishItem, idx) {
		buyerSession.removeFromWishlist(wishItem.item.id).success(function(data) {
			console.log(data);
			$scope.wishlistItems.splice(idx, 1);
		});
	}
}
 
function SellerDashboardCtrl($scope) {}
