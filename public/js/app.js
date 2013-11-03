'use strict';

/* Defines Vestaro main module */
var vestaroMain = angular.module('vestaroMain', []);

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
vestaroMain.factory('buyerSession', function($http){
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
                    primary: {title: 'Continuar', href: ''},
                    'default': {title: 'Ir a Wishlist', href: ''}
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
                        primary: {title: 'Continuar', href: ''},
                        'default': {title: 'Ir a Wishlist', href: ''}
                      }
                    };
                  $('#alertModal').modal('show');
                  break;

                default:
                  $scope.alert =
                    {title:'Oops, parece que hubo un problema',
                      type:'error',
                      body: 'La prenda ' + item.title + ' no pudo ser agregada a tu wishlist.',
                      btns: {
                        primary: {title: 'Continuar', href: ''},
                        'default': {title: 'Ir a Wishlist', href: ''}
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
});

vestaroMain.factory('facebook', function($location){
  return {
    feedDialog: function(item, callback){
      if (callback == null){
        callback = function(response) {
          if (response && response.post_id) {
            console.log('Facebook: Publicación exitosa. Post id:' + response.post_id);
          } else {
            alert('Post was not published.');
            console.log(response);
          }
        }
      }
      FB.ui(
        {
         method: 'feed',
         name: item.title,
         caption: item.seller.brandName,
         description: (item.description),
         link: $location.host() + '/garment/' + item.id,
         picture: item.imgUrl
        },
        callback
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
});