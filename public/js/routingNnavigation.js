angular.module('vestaroMain', ['firebase']).
  config(function($routeProvider) {
	  $routeProvider.
      when('/', {controller:BuyerHomeCtrl, templateUrl:'assets/html/buyerHome.html'}).
      when('/dashboard', {controller:SellerDashboardCtrl, templateUrl:'assets/html/sellerDashboard.html'}).
      otherwise({redirectTo:'/'});
  });

function BuyerHomeCtrl($scope) {
  $scope.projects = [{name: "a", description: "desc"}, {name:"b", description:"desc 2"}];
}
 
function SellerDashboardCtrl($scope) {
}