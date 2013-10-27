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
.controller('serverPageRoutingCtrl', ['$scope', '$routeParams', '$location',function($scope, $routeParams, $location){
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
        addToWishlist: function(item) {
        	return $http.post('/wishlist', {'itemId': item.id})
	        	.success(function(data){
				  console.log(data);
				  $scope.alert = {title:'Prenda agregada a Wishlist',
							type:'info',
							body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
							btns: {primary: {title: 'Seguir', href: ''},
								   'default': {title: 'Ir a Wishlist', href: '#/wishlist'}
							}
					};
					$('#alertModal').modal('show');
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

/* Controllers */
function BuyerHomeCtrl($scope, buyerSession) {
  buyerSession.getItems().success(function(data){
	  $scope.items = data;
  });
  
  buyerSession.getPopularItems().success(function(data){
	  $scope.popularItems = data;
  });
  
  $scope.$on('isotope', isotopeHandling);
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  buyerSession.addToWishlist(item);
  }
  
  var $container = $('#itemsContainer');
	// Toggles item size
	$container.on('click', '.item-img', function() {
		var $item = $(this).closest('.item'); 
		if ($item.hasClass('large')) {
			$item.removeClass('large');
		} else {
			$container.find('.item.large').removeClass('large');
			$item.closest('.item').addClass('large');
		}
		$container.isotope('reLayout');
	});
	
	// Toggles item information
	$container.on('.item', 'mouseenter mouseleave', function(e) {
		e.preventDefault();
		$(this).find('.itemInformation').fadeToggle('fast');
	});
	
	// Toggle know more
	$('#knowMoreBtn').click(function(){
		$('#knowMore').slideToggle()
	})
  
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
}

function ItemSearchCtrl($scope, buyerSession) {
  
  $scope.categories = buyerSession.getCategories();
//  $scope.selectedCategory = $scope.categories[0];
  
  buyerSession.getItems().success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  buyerSession.addToWishlist(item);
  }
  
}

function WishlistCtrl($scope, buyerSession, $http) {

	buyerSession.getWishlist().success(function(data) {
		$scope.wishlistItems = data;
	});
	
	$scope.removeFromWishlist = function(item, idx) {
		buyerSession.removeFromWishlist(item.id).success(function(data) {
			console.log(data);
			$scope.wishlistItems.splice(idx, 1);
			$scope.alert = {title:'Prenda eliminada de Wishlist',
					type:'info',
					body: 'La prenda ' + item.title + ' fue eliminada de tu wishlist.',
					btns: {primary: {title: 'Seguir', href: ''},
						   'default': {title: 'Ir a Home', href: '#/'}
					}
			};
			$('#alertModal').modal('show');
		});
	}
}


function SellerDashboardCtrl($scope){}
function CollectionsCtrl(){}
function SelletSettingsCtrl(){}
