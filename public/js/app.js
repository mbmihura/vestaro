'use strict';

/* Defines Vestaro main module */
var vestaroMain = angular.module('vestaroMain', []);

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