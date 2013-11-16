/* Buyer Controllers */
vestaroMain.controller('BuyerHomeCtrl', ['$scope', 'BuyerSession', 'Facebook', 'Easyrec',
	function ($scope, BuyerSession, Facebook, Easyrec) {

  // Get Most Viewed Items.
  // If user is not logged in the app, this will get unisex items only.
  Easyrec.getRecommendations('mostvieweditems', authData.fbUser).
  	success(function(data){
  		console.log(data);
  		if(!data.recommendeditems){
  			$scope.mostViewedItems = null;
  			return;
  		}
  		BuyerSession.getItemsByList(data.recommendeditems.item).
  			success(function(data){
  				$scope.mostViewedItems = data;
  			});
  	}).
  	error(function(data){
  		console.log(data);
  });
  
  // Get Recommendations For User.
  // If user is not logged in the app, this will get all items.
  Easyrec.getRecommendations('recommendationsforuser', authData.fbUser).
  	success(function(data){
  		console.log(data);
  		if(!data.recommendeditems){
  			// User has no recommendations.
  			$scope.userHasRecommendations = false;
  			BuyerSession.getItems().success(function(data){
  				$scope.recommendedItems = data;
  				$scope.$on('isotope', isotopeHandling);
  			});
  		} else {
  			$scope.userHasRecommendations = true;
	  		BuyerSession.getItemsByList(data.recommendeditems.item).
	  			success(function(data){
	  				console.log(data);
	  				$scope.recommendedItems = data;
	  				$scope.$on('isotope', isotopeHandling);
	  		});
	  	}
  	}).
  	error(function(data){
  		console.log(data);
  });
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  BuyerSession.addToWishlist(item);
  }

  $scope.shareItem = function(item){
  	Facebook.feedDialog(item, $scope);
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

	// Toggle know more
	$('#knowMoreBtn').click(function(){
		$('#knowMore').slideToggle()
	});
  
}]);

var isotopeHandling = function(ngRepeatFinishedEvent) {

	var $container = $('#itemsContainer');
	var options = {
		itemSelector : '.item',
		getSortData : {
			price : function($elem) {
				return parseFloat($elem.find('.price').text().replace('$', ''));
			},
			title : function($elem) {
				return $elem.find('.item-title').text();
			}
		},
		sortBy : 'title'
	};
	
	// Wait until all images are loaded
	$container.imagesLoaded(function() {
		$container.isotope(options);
		$('.progress.progress-striped.active').fadeOut();
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

vestaroMain.controller('ItemSearchCtrl', ['$scope','BuyerSession','Easyrec',
	function ($scope, BuyerSession, Easyrec) {

  $scope.categories = BuyerSession.getCategories();

  $scope.viewItem = function(item){
  	Easyrec.sendAction('view', item).
	  	success(function(data) {
	        console.log(data);
	      }).
	      error(function(data) {
	        console.log(data);
	    });;
  }
  
  BuyerSession.getItems().success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  BuyerSession.addToWishlist(item);
  }

  $scope.shareItem = function(item){
  	Facebook.feedDialog(item, $scope);
  }
  
}]);

vestaroMain.controller('WishlistCtrl', ['$scope', 'BuyerSession', '$rootScope',
	function ($scope, BuyerSession, $rootScope) {

	BuyerSession.getWishlist().success(function(data) {
		$scope.wishlistItems = data;
	});

	$scope.shareItem = function(item){
  		Facebook.feedDialog(item, $scope);
  	}
	
	$scope.removeFromWishlist = function(item, idx) {
		BuyerSession.removeFromWishlist(item.id).success(function(data) {
			console.log(data);
			$scope.wishlistItems.splice(idx, 1);
			$rootScope.alert = {title:'Prenda eliminada de Wishlist',
				type:'info',
				body: 'La prenda ' + item.title + ' fue eliminada de tu wishlist.',
				btns: {
					primary: {order: 1, title: 'Continuar', type: 'info', href: ''}
				}
			};
			$('#alertModal').modal('show');
		});
	}
}]);
