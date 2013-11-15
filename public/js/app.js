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
              //TODO: replace with angular new pattern
              switch (response.status) {
                case 401:
                    // TODO: replace 
                    $('#loginBtn').popover('show');
                    return $q.reject(response);
                    break;
                case 403:
                    if (response.config.url.indexOf(".html"))
                    {
                      // get $http via $injector because of circular dependency problem
                      $http = $http || $injector.get('$http');
                      var defer = $q.defer();
                      $http.get('/assets/html/server/403Forbidden.html')
                        .then(function (result) {
                          response.status = 200;
                          response.data = result.data;
                          defer.resolve(response);
                        }, function () {
                          defer.reject(response);
                          });
                      return defer.promise;// response;
                    } else {
                      //TODO; show remote modal with 403 page.
                      return $q.reject(response);
                    }
                    break;
                case 404:
                    if (response.config.url.indexOf(".html"))
                    {
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
                    break;
                case 500:
                    // get $http via $injector because of circular dependency problem
                    $http = $http || $injector.get('$http');
                    var defer = $q.defer();
                    $http.get('/assets/html/server/500InternalError.html')
                        .then(function (result) {
                            response.status = 200;
                            response.data = result.data;
                            defer.resolve(response);
                        }, function () {
                            defer.reject(response);
                        });

                    return defer.promise;// response;
                    break;
                default:
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
vestaroMain.factory('buyerSession', ['$http', '$rootScope', 'facebook', function ($http, $rootScope, facebook){
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
        addToWishlist: function(item){
          return $http.post('/wishlist', {'itemId': item.id})
            .success(function(data){
              console.log(data);
              $rootScope.alert =
                {title:'Prenda agregada a Wishlist',
                  type:'info',
                  body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
                  btns: {
                    primary: {order: 1, title: 'Continuar', type: 'info', href: ''}
                    // ,'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                  }
                };
              $('#alertModal').modal('show');
              // TODO: check status
              // facebook.likeItem(item, null);
            })
            .error(function(data, status, headers, config){
              console.log(status);
              switch(status) {
                // TODO: centralize error handling.
                case 401: // Unauthorized
                  $('#registerAsBuyerBtn').popover('show');
                  break;

                case 409: // Confilct: duplicate item
                  $rootScope.alert =
                    {title:'La prenda ya está en tu Wishlist',
                      type:'warning',
                      body: 'La prenda ' + item.title + ' ya fue agregada a tu wishlist.',
                      btns: {
                        primary: {order: 1, title: 'Continuar', type: 'warning', href: ''}
                        // ,'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                      }
                    };
                  $('#alertModal').modal('show');
                  break;

                default:
                  $rootScope.alert =
                    {title:'Oops, parece que hubo un problema',
                      type:'danger',
                      body: 'La prenda ' + item.title + ' no pudo ser agregada a tu wishlist.',
                      btns: {
                        primary: {order: 1, title: 'Continuar', type: 'danger', href: ''}
                        // ,'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
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

vestaroMain.factory('facebook', ['$location', '$rootScope', function ($location, $rootScope){
  return {
    feedDialog: function(item){
      FB.ui(
        {
         method: 'feed',
         name: item.title,
         caption: item.seller.brandName,
         description: item.description,
         link: $location.host() + '/garment/' + item.id,
         picture: $location.host() + item.imgUrl
        },
        function(response) {
          if (response && response.post_id) {
            console.log('Facebook: Publicación exitosa. Post id:' + response.post_id);
          } else if (response.error) {
            alert('Facebook: Error occurred.');
            console.log('Error: ' + response.error.message);
           } else {
            console.log('Facebook: Error occurred.');
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
            console.log('Facebook: Error occurred.');
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
