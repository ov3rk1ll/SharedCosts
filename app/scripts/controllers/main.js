'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('MainCtrl', function ($scope, $stateParams, AuthService, $cookies) {
    /*$scope.login=function() {
        // https://accounts.google.com/o/oauth2/auth?redirect_uri=https://developers.google.com/oauthplayground&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline
     	var clientId='174190054188-fnomfn083gohkmq9okkapqbevgitltnd.apps.googleusercontent.com';
     	var scope='https://www.googleapis.com/auth/userinfo.email';
     	var redirectUri='http://localhost:9000';
     	var responseType='token';
     	var url='https://accounts.google.com/o/oauth2/auth?scope='+scope+'&client_id='+clientId+'&redirect_uri='+redirectUri+'&response_type='+responseType;
     	window.location.replace(url);
     };*/
    if($cookies.authtoken){        
        AuthService.login($cookies.authtoken, $stateParams.returnUrl);  
    }

     $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
        $scope.isLoggedIn = isLoggedIn;
        $scope.currentUser = AuthService.currentUser();
     });
  });
