'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('NavigationCtrl', function ($scope, $rootScope, List, AuthService) {
  	$scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
        if(isLoggedIn){
        	List.query(function(data){
		        $scope.projects = data;
		    });
        }
     });

  	$scope.$watch( $rootScope.$state, function ( state ) {
    	console.log(state);
    });


    $scope.login = function(){ AuthService.oauth(); };

    $scope.logout = function(){ AuthService.oauth(); };
    
  });
