/* Buyer Controllers */
vestaroMain.controller('BuyerHomeCtrl', ['$scope', 'buyerSession', 'facebook',
	function ($scope, buyerSession, facebook) {

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

		$scope.shareItem = function(item){
			facebook.feedDialog(item, $scope);
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
	}
]);

var isotopeHandling = function(ngRepeatFinishedEvent) {

	var $container = $('#itemsContainer');
	var options = {
		itemSelector : '.item',
		getSortData : {
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

vestaroMain.controller('ItemSearchCtrl', ['$scope','buyerSession', 'facebook',
	function ($scope, buyerSession, facebook) {

		$scope.categories = buyerSession.getCategories();
		$scope.getFriends = function(){
			FB.api(
			{
				method: 'fql.query',
				query: 'SELECT uid, name, pic_square, sex FROM user WHERE is_app_user=1' +
				'AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
			},
			function(result) {
				if(result.error){
					alert(result.error);
				} else {
					$scope.$apply(function() {
						$scope.friends = result;
						$('#friendsListModal').modal('show');
					});
				}
			}
			);
		};

		$scope.setFriend = function(friend) {
			$scope.selectedFriend = friend;
		}

		$scope.isSelected = function(friend) {
			return $scope.selectedFriend === friend;
		}

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
]);

vestaroMain.controller('WishlistCtrl', ['$scope', 'buyerSession', '$rootScope',
	function ($scope, buyerSession, $rootScope) {

		buyerSession.getWishlist().success(function(data) {
			$scope.wishlistItems = data;
		});

		$scope.removeFromWishlist = function(item, idx) {
			buyerSession.removeFromWishlist(item.id).success(function(data) {
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
	}
]);
