'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:EntryeditCtrl
 * @description
 * # EntryeditCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('EntryeditCtrl', function ($scope, item, project, $location) {
  	if($location.search().clone){ item.id = ''; }

    $scope.item = item;
    $scope.projectId = project.data.id
    $scope.members = project.payments;

    $scope.dateOptions = {
	    startingDay: 1
	  };

  	$scope.format = 'dd.MM.yyyy';

    $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

    $scope.dismiss = function() {
        $scope.$dismiss();
    };

    $scope.save = function() {
        item.$save({projectId: $scope.projectId}).then(function() {
          $scope.$close(true);
        });
    };
      
    $scope.remove = function() {
        if(window.confirm('Are you sure?')){
            item.$delete({projectId: $scope.projectId}).then(function() {
                $scope.$close(true);
            });
        }
    };
  });
