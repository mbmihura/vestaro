angular.module('vestaroMain', []).
  config(function($routeProvider) {
	  
	  var template = '<div ng-include="templateUrl">Loading...</div>';
	  
	  $routeProvider.
      when('/', {controller:BuyerHomeCtrl, templateUrl:'assets/html/buyerHome.html'}).
      when('/dashboard', {controller:SellerDashboardCtrl, templateUrl:'assets/html/sellerDashboard.html'}).
      when('/:serverPageUrl', {template: template, controller: 'serverPageRoutingCtrl'}).
      otherwise({redirectTo:'/'});
  });

angular.module('vestaroMain').controller('serverPageRoutingCtrl', ['$scope', '$routeParams' ,function($scope, $routeParams){
	  $scope.templateUrl = "/" + $routeParams.serverPageUrl;
	}]);

function BuyerHomeCtrl($scope) {
  $scope.projects = [{name: "a", description: "desc"}, {name:"b", description:"desc 2"}];
}
 
function SellerDashboardCtrl($scope) {
}