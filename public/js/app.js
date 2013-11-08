'use strict';

/* Defines Vestaro main module */
var vestaroMain = angular.module('vestaroMain', ['ngResource']);

/* Configurations */
vestaroMain.config(['$httpProvider', function ($httpProvider) {

    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {

           function success(response) {
                return response;
            }

            function error(response) {
                if (response.status === 404 && response.config.url.indexOf(".html")) {

                    // get $http via $injector because of circular dependency problem
                    $http = $http || $injector.get('$http');
                    var defer = $q.defer();
                    $http.get('/assets/html/server/404NotFound.html')
                        .then(function (result) {
                            response.status = 200;
                            response.data = result.data;
                            defer.resolve(response);
                        }, function () {
                            defer.reject(response);
                        });

                    return defer.promise;// response;
                } else {
                    return $q.reject(response);
                }
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

/* Data Factory */
vestaroMain.factory('buyerSession', ['$http', 'facebook', function($http, facebook){
    return {
        getWishlist: function(){
            return $http.get('/wishlist');
        },
        getItems: function(){
            return $http.get('/garment');
        },
        // TODO: replace with easyrec request.
        getPopularItems: function(){
            return $http.get('/garment');
        },
        // TODO: replace with server request for categories.
        getCategories: function(){
            return [ {id: 0, name: 'Todas', sexo: 'Todos'},
                     {id: 1, name: 'Camisa', sexo: 'Mujer'},
                     {id: 2, name: 'Campera', sexo: 'Hombre'}];
        },
        addToWishlist: function(item, $scope){
          return $http.post('/wishlist', {'itemId': item.id})
            .success(function(data){
              console.log(data);
              $scope.alert =
                {title:'Prenda agregada a Wishlist',
                  type:'info',
                  body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
                  btns: {
                    primary: {order: 1, title: 'Continuar', type: 'info', href: ''},
                    'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                  }
                };
              $('#alertModal').modal('show');
              // TODO: check status
              // facebook.likeItem(item, null);
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
                        primary: {order: 1, title: 'Continuar', type: 'warning', href: ''},
                        'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                      }
                    };
                  $('#alertModal').modal('show');
                  break;

                default:
                  $scope.alert =
                    {title:'Oops, parece que hubo un problema',
                      type:'danger',
                      body: 'La prenda ' + item.title + ' no pudo ser agregada a tu wishlist.',
                      btns: {
                        primary: {order: 1, title: 'Continuar', type: 'danger', href: ''},
                        'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                      }
                    };
                  $('#alertModal').modal('show');
              }
            });
        },
        removeFromWishlist: function(itemId){
            return $http.delete('/wishlist/' + itemId);
        }
    };
}]);

vestaroMain.factory('garmentsApi', ['$resource', function($resource) {
  return $resource('/garment/:id', null, { 
      save: { 
        method: 'PUT', 
        params: { id: '@id' }, 
        isArray: false 
      } 
    });
}]);

vestaroMain.factory('facebook', ['$location', function($location){
  return {
    feedDialog: function(item, $scope){
      FB.ui(
        {
         method: 'feed',
         name: item.title,
         caption: item.seller.brandName,
         description: (item.description),
         link: $location.host() + '/garment/' + item.id,
         picture: item.imgUrl
        },
        function(response) {
          if (response && response.post_id) {
            console.log('Facebook: Publicación exitosa. Post id:' + response.post_id);
          } else {
            $scope.alert =
              {title:'Oopss! Parece que hubo un problema.',
                type:'danger',
                body: 'La prenda ' + item.title + ' no pudo compartirse en Facebook.',
                btns: {
                  primary: {order: 1, title: 'Continuar', type: 'danger', href: ''}
                }
              };
            $('#alertModal').modal('show');
          }
        }
      );
    },
    likeItem: function(item, callback){
      if (callback == null){
        callback = function(response) {
           if (response) {
            console.log('https://www.facebook.com/me/activity/' + response.id);
           } else if (response.error) {
            alert('Facebook: Error occurred.');
            console.log('Error: ' + response.error.message);
           } else {
            alert('Facebook: Error occurred.');
           }
         }
      }
      FB.api(
         'https://graph.facebook.com/me/og.likes',
         'post',
         { object: item.imgUrl, // TODO: replace with item preview page.
           privacy: {'value': 'SELF'} }, // TODO: remove when in production.
         callback
      );
    }
  };
}]);
