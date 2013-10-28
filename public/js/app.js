'use strict';

/* Defines Vestaro main module */
var vestaroMain = angular.module('vestaroMain', []);

/* Configurations */
vestaroMain.config(['$httpProvider', function ($httpProvider) {
-
-    var $http,
-        interceptor = ['$q', '$injector', function ($q, $injector) {
-
-            function success(response) {
-                return response;
-            }
-
-            function error(response) {
-                if (response.status === 404 && response.config.url.indexOf(".html")) {
-
-                    // get $http via $injector because of circular dependency problem
-                    $http = $http || $injector.get('$http');
-
-                    var defer = $q.defer();
-                    $http.get('/assets/html/server/404NotFound.html')
-                        .then(function (result) {
-                            response.status = 200;
-                            response.data = result.data;
-                            defer.resolve(response);
-                        }, function () {
-                            defer.reject(response);
-                        });
-
-                    return defer.promise;// response;
-                } else {
-                    return $q.reject(response);
-                }
-            }
-
-            return function (promise) {
-                return promise.then(success, error);
-            }
-        }];
-
-    $httpProvider.responseInterceptors.push(interceptor);
-}]);

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
        addToWishlist: function(item) {
            return $http.post('/wishlist', {'itemId': item.id})
                .success(function(data){
                  console.log(data);
                  $scope.alert = {title:'Prenda agregada a Wishlist',
                            type:'info',
                            body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
                            btns: {primary: {title: 'Seguir', href: ''},
                                   'default': {title: 'Ir a Wishlist', href: '#/wishlist'}
                            }
                    };
                    $('#alertModal').modal('show');
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
