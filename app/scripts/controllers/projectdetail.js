'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:ProjectdetailCtrl
 * @description
 * # ProjectdetailCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('ProjectdetailCtrl', function ($scope, $rootScope, current, entries, AuthService) {
    $rootScope.$title = current.data.name;
  	$scope.project = current;
  	$scope.entries = entries;
  	$scope.members = current.members;
  	
    $scope.chartMembers = { };
    $scope.group = {open: false};

    $scope.hasPermission = AuthService.hasPermission;

    $scope.$watch('group.open', function (isOpen){
      if(!isOpen || $scope.chartMembers.data) return;
      $scope.renderChart();
    });

    $scope.renderChart = function(){
      var data = [];
      for (var m in $scope.members){
        data.push({label: $scope.members[m].name, value: $scope.members[m].paid});
      }
      $scope.chartMembers = { data: data };
    }
  });
