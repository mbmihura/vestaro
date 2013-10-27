'use strict';

/* Rounting Configuration */
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

