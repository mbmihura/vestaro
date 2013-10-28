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
	  buyerSession.addToWishlist(item, $scope);
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
	  buyerSession.addToWishlist(item, $scope);
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