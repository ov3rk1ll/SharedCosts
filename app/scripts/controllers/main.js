'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('MainCtrl', function ($scope, $stateParams, AuthService, $cookieStore) {

    if($cookieStore.get('authtoken') && !AuthService.isLoggedIn() ){        
        AuthService.login($cookieStore.get('authtoken'), $stateParams.returnUrl);  
    }

     $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
        $scope.isLoggedIn = isLoggedIn;
        $scope.currentUser = AuthService.currentUser();
     });

    $scope.login = function(){ AuthService.oauth(); };

    $scope.logout = function(){ AuthService.oauth(); };
  });
