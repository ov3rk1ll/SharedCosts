'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:ProjectdetailCtrl
 * @description
 * # ProjectdetailCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('ProjectdetailCtrl', function ($scope, current, entries) {
  	$scope.project = current;
  	$scope.entries = entries;
  	$scope.members = current.payments;
  	var data = [];
  	for (var m in $scope.members){
  		data.push({label: $scope.members[m].name, value: $scope.members[m].paid});
  	}
  	$scope.chartMembers = { data: data };
  });
