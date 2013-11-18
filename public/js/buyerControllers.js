/* Buyer Controllers */
vestaroMain.controller('BuyerHomeCtrl', ['$scope', 'BuyerSession', 'Facebook', 'Easyrec',
function ($scope, BuyerSession, Facebook, Easyrec) {

	$scope.userHasRecommendations = true;
	
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
  		// TODO: alert Easyrec not working.
  		$scope.mostViewedItems = null;
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
	  	// TODO: alert Easyrec not working.
		BuyerSession.getItems().success(function(data){
			$scope.recommendedItems = data;
			$scope.$on('isotope', isotopeHandling);
		});
  });
  
  $scope.addToWishlist = function(item){
	  BuyerSession.addToWishlist(item);
  }

  $scope.shareItem = function(item){
  	Facebook.feedDialog(item, $scope);
  }

}]);

var isotopeHandling = function(ngRepeatFinishedEvent) {

	var $container = $('#itemsContainer');
	var $loadContainer = $('#itemsLoadContainer');
	var options = {
		itemSelector : '.item'
	};
	
	// Wait until all images are loaded
	$loadContainer.imagesLoaded(function() {
		$container.isotope(options)
			.isotope('insert', $loadContainer.find('.item'));
		$('.progress.progress-striped.active').fadeOut();
	});

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

vestaroMain.controller('ItemSearchCtrl', ['$scope','BuyerSession','Easyrec',
	function ($scope, BuyerSession, Easyrec) {

		$scope.friendHasRecommendations = true;
		$scope.isLogged = authData.fbUser !== undefined;
		
		BuyerSession.getCategories().success(function(data){
			$scope.categories = data;
			$scope.selectedCategory = $scope.categories[0];
		});

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

		$scope.viewItem = function(item){
			Easyrec.sendAction('view', item).
				success(function(data) {
					console.log(data);
				}).
				error(function(data) {
					console.log(data);
			});;
		}

		$scope.makePresent = function(){
			var fbUser = {};
			fbUser.id = $scope.selectedFriend.uid;
			fbUser.gender = $scope.selectedFriend.sex;

			Easyrec.getRecommendations('recommendationsforuser', fbUser).
				success(function(data){
					console.log(data);
					if(!data.recommendeditems){
						// If last friend selected had recommendations.
						if($scope.friendHasRecommendations){
							BuyerSession.getItems().success(function(data) {
								$scope.items = data;
							});
						}
			  			// Friend has no recommendations.
			  			$scope.friendHasRecommendations = false;
			  		} else {
			  			$scope.friendHasRecommendations = true;
			  			BuyerSession.getItemsByList(data.recommendeditems.item).
			  			success(function(data){
			  				console.log(data);
			  				$scope.items = data;
			  			});
			  		}
				}).
				error(function(data){
					// Friend has no recommendations.
			  		$scope.friendHasRecommendations = false;
					console.log(data);
			});
		}

		$scope.cancelPresent = function(){
			$scope.selectedFriend = null;
			if($scope.friendHasRecommendations){
				BuyerSession.getItems().success(function(data) {
					$scope.items = data;
				})
				.error(function(data){
					console.log(data);
					// TODO: alert Easyrec not working.
				});
			} else {
				$scope.friendHasRecommendations = true;
			}
		}

		BuyerSession.getItems().success(function(data) {
			$scope.items = data;
		});

		$scope.addToWishlist = function(item){
			BuyerSession.addToWishlist(item);
		}

	}
]);

vestaroMain.controller('WishlistCtrl', ['$scope', 'BuyerSession', '$rootScope', 'Facebook',
	function ($scope, BuyerSession, $rootScope, Facebook) {

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
				type:'success',
				body: 'La prenda ' + item.title + ' fue eliminada de tu wishlist.',
				btns: {
					primary: {order: 1, title: 'Continuar', type: 'success', href: ''}
				}
			};
			$('#alertModal').modal('show');
		});
		}
	}
]);
