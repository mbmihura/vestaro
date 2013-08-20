angular.module('project', ['firebase']).
  value('fbURL', 'https://angularjs-projects.firebaseio.com/').
  factory('Projects', function(angularFireCollection, fbURL) {
    return angularFireCollection(fbURL);
  }).
  config(function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list'}).
      when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail'}).
      otherwise({redirectTo:'/'});

      //$locationProvider.html5Mode(true); Disables the '#' in the urls.
  });
 
function ListCtrl($scope, Projects) {
  $scope.projects = Projects;
  $scope.projects.range = function() {
      var range = [];
      for( var i = 0; i < $scope.projects.length; i = i + 3 )
          range.push(i);
      return range;
  }
}
 
function CreateCtrl($scope, $location, $timeout, Projects) {
  $scope.save = function() {
    Projects.add($scope.project, function() {
      $timeout(function() { $location.path('/'); });
    });
  }
}
 
function EditCtrl($scope, $location, $routeParams, angularFire, fbURL) {
  angularFire(fbURL + $routeParams.projectId, $scope, 'remote', {}).
  then(function() {
    $scope.project = angular.copy($scope.remote);
    $scope.project.$id = $routeParams.projectId;
    $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.project);
    }
    $scope.destroy = function() {
      $scope.remote = null;
      $location.path('/');
    };
    $scope.save = function() {
      $scope.remote = angular.copy($scope.project);
      $location.path('/');
    };
  });
}