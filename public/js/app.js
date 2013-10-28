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
        addToWishlist: function(item, $scope) {
            return $http.post('/wishlist', {'itemId': item.id})
                .success(function(data){
                  console.log(data);
                  $scope.alert =
                    {title:'Prenda agregada a Wishlist',
                      type:'info',
                      body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
                      btns: {
                        primary: {title: 'Seguir', href: ''},
                        'default': {title: 'Ir a Wishlist', href: '#/wishlist'}
                      }
                    };
                  $('#alertModal').modal('show');
              })
              .error(function(data, status, headers, config){
                  console.log(status);
                  switch(status) {
                    case 401: // Unauthorized
                      $('#loginBtn').popover('show');
                      break;

                    case 400: // TODO: change server response from badRequest to sth mor appropiate.
                      $scope.alert =
                        {title:'La prenda ya está en tu Wishlist',
                          type:'warning',
                          body: 'La prenda ' + item.title + ' ya fue agregada a tu wishlist.',
                          btns: {
                            primary: {title: 'Seguir', href: ''},
                            'default': {title: 'Ir a Wishlist', href: '#/wishlist'}
                          }
                        };
                      $('#alertModal').modal('show');
                      break;
                  }
              });
        },
        removeFromWishlist: function(itemId) {
            return $http.delete('/wishlist/' + itemId);
        },
        hideAlertModal: function() {
          $('.modal-backdrop').remove();
        }
    };
});
