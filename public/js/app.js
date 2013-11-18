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
vestaroMain.factory('BuyerSession', ['$http', '$rootScope', 'Facebook', function ($http, $rootScope, Facebook){
    return {
        getWishlist: function(){
            return $http.get('/wishlist');
        },
        getItems: function(){
            return $http.get('/garment');
        },
        getItemsByList: function(recommendeditems){
            var itemsIds = "";
            var first = true;
            angular.forEach(recommendeditems, function(item){
              if (first){
                itemsIds += item.id;
                first = false;
              } else {
                itemsIds += "," + item.id;
              }
            });
            var itemsList = {};
            itemsList.items = itemsIds;
            console.log(itemsList);
            return $http.post('/getItemsByList', itemsList);
        },
        // TODO: replace with server request for categories.
        getCategories: function(){
            return $http.get('/categories');
        },
        addToWishlist: function(item){
          return $http.post('/wishlist', {'itemId': item.id})
            .success(function(data){
              console.log(data);
              $rootScope.alert =
                {title:'Prenda agregada a Wishlist',
                  type:'success',
                  body: 'La prenda ' + item.title + ' fue agregada a tu wishlist.',
                  btns: {
                    primary: {order: 1, title: 'Continuar', type: 'success', href: ''}
                    // ,'default': {order: 2, title: 'Ir a Wishlist', type: 'default', href: ''}
                  }
                };
              $('#alertModal').modal('show');
              // TODO: check status
              // Facebook.likeItem(item, null);
            })
            .error(function(data, status, headers, config){
              console.log(status);
              switch(status) {
                // TODO: centralize error handling.
                case 401: // Unauthorized
                  $('#loginBtn').popover('show');
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

vestaroMain.factory('Facebook', ['$location', '$rootScope', function ($location, $rootScope){
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
    },
    // Returns fbid, name and picture of friends that are using the application
    getFriendsUsingApp: function(){
      var friends = [];
      FB.api(
        {
            method: 'fql.query',
            query: 'SELECT uid, name FROM user WHERE uid IN(SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user=1'
        },
        function(users) {
          angular.forEach(users, function(user){
            var friend = {};
            friend.id = user.uid;
            friend.name = user.name;
            FB.api('/' + user.uid + '?fields=picture',
              function(userPic){
                friend.picture = userPic.picture.data.url;
            });
            friends.push(friend);
          });
          console.log(friends);
          return friends;
        }
      );
    }
  };
}]);

vestaroMain.factory('Easyrec', ['$http', function($http){
  var easyrec = {};
  easyrec.extend = function (options, defaults) {
    var target = options;

    for (var propertyName in defaults) {
      var src = target[ propertyName ];
      var copy = defaults[ propertyName ];

      if (src != null) {
        continue;
      } else if (copy !== undefined) {
        target[ propertyName ] = copy;
      }
    }
    // Return the modified object
    return target;
  }

  //Session functions
  easyrec.createSessionId = function () {
    var name = "easyrec_sessionVar";
    var value = easyrec.generateSessionId(15);
    String((new Date()).getTime()).replace(/\D/gi, '');
    document.cookie = name + "=" + value + "; path=/";
    return value;
  }

  easyrec.generateSessionId = function (length) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var returnValue = "";

    for (x = 0; x < length; x++) {
      var i = Math.floor(Math.random() * 62);
      returnValue += chars.charAt(i);
    }

    return "JS_" + returnValue;
  }

  easyrec.getSessionId = function() {
    var nameEQ = "easyrec_sessionVar=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return easyrec.createSessionId();
  }

  var defaults = {
    userId:null,
    itemId:"-1",
    sessionId:easyrec.getSessionId(),
    itemUrl:"",
    itemDescription:"",
    itemImageUrl:"",
    timeRange:"ALL",
    numberOfResults:10,
    actionTime:null,
    strategy:"NEWEST",
    useFallback:false,
    itemType:"ITEM",
    requestedItemType:"ITEM",
    clusterId:null,
    basedOnActionType:"VIEW"
  };

  /* Easyrec API */
  return {
    /* recommendationType = { 'otherusersalsoviewed',
        'otherusersalsobought',
        'itemsratedgoodbyotherusers',
        'recommendationsforuser',
        'relateditems',
        'actionhistoryforuser',
        'mostvieweditems',
        'mostboughtitems'
      }
      options = {
        userId: authData.currentUser.id,
        requesteditemtype = { 'male', 'female', 'unisex' }
      }
      */
      getRecommendations: function(recommendationType, fbUser){
        var options = {};
        if(fbUser){
          options.userId = fbUser.id;
          options.requestedItemType = fbUser.gender;
        } else {
          options.requestedItemType = 'unisex';
        };

        var o = easyrec.extend(options, defaults);

        var easyrecUrl = easyrecApiUrl + recommendationType + "?" +
        "tenantid=" + tenantId +
        "&apikey=" + apiKey +
        ((o.userId) ? ("&userid=" + o.userId ) : "") +
        "&itemid=" + o.itemId +
        "&itemtype=" + o.itemType +
        "&requesteditemtype=" + o.requestedItemType +
        "&actiontype=" + o.basedOnActionType +
        "&callback=JSON_CALLBACK" +
        "&numberOfResults=" + o.numberOfResults +
        ((o.assocType) ? ("&assoctype=" + o.assocType ) : "");

        return $http.jsonp(easyrecUrl);
      },
      /* actionType = { 'buy', 'view', '...' } */
      sendAction: function(actionType, item){
        var options = {};
        if(authData.fbUser){
          options.userId = authData.fbUser.id;
        } else {
          options.userId = 0;
        }
        options.itemId = item.id;
        options.itemUrl = '/#/garment/' + item.id;
        options.itemDescription = item.title;
        options.itemImageUrl = item.imgUrl;
        options.itemType = item.sex=='m'?'male':(item.sex=='f'?'female':'unisex');
        options.actionType = actionType;

        var o = easyrec.extend(options, defaults);

        var easyrecUrl = easyrecApiUrl + actionType + "?" +
        "tenantid=" + tenantId +
        "&apikey=" + apiKey +
        ((o.userId) ? ("&userid=" + o.userId ) : "") +
        "&itemid=" + o.itemId +
        "&sessionid=" + o.sessionId +
        "&itemurl=" + encodeURIComponent(o.itemUrl) +
        "&itemdescription=" + encodeURIComponent(o.itemDescription) +
        "&itemimageurl=" + encodeURIComponent(o.itemImageUrl) +
        "&ratingvalue=" + o.ratingValue +
        "&itemtype=" + o.itemType +
        "&callback=JSON_CALLBACK" +
        ((o.actionType) ? ("&actiontype=" + o.actionType ) : "") +
        ((o.actionValue) ? ("&actionvalue=" + o.actionValue ) : "") +
        ((o.actionTime) ? ("&actiontime=" + o.actionTime ) : "");

        return $http.jsonp(easyrecUrl);
      }
  }
}]);

