'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:ProjectlistCtrl
 * @description
 * # ProjectlistCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('ProjectlistCtrl', function ($scope, List, $rootScope) {
    List.query(function(data){
        $scope.projects = data;
    });
  });
