'use strict';

/**
 * @ngdoc function
 * @name sharedcostApp.controller:ProjecteditCtrl
 * @description
 * # ProjecteditCtrl
 * Controller of the sharedcostApp
 */
angular.module('sharedcostApp')
  .controller('ProjecteditCtrl', function ($scope, $rootScope, $state, current, $http, settings, AuthService) {
    $scope.item = current;

    var oldId = $scope.item.data ? $scope.item.data.id : null;
    console.log(oldId);

    if(!AuthService.hasPermission(current, 4) && oldId){
    	$state.go('home');
    }

    if(!oldId){
    	$scope.item.members = [{
	    	name: AuthService.currentUser().name,
	    	picture: AuthService.currentUser().picture,
	    	level: 15,
	    	id: AuthService.currentUser().user_id
	    }];
    }

    $scope.remove = function(array, index){
	    array.splice(index, 1);
	}

	$scope.add = function(user){
	    $scope.item.members.push({
	    	name: user.authid.name,
	    	picture: user.authid.picture,
	    	level: user.level,
	    	authid: user.authid.id,
	    	id: '0',
	    	provider: 'google'
	    });
	    $scope.newuser = {};
	}

	$scope.save = function(){
		$scope.item.$save(
			function(item){
				$rootScope.$broadcast('projectWasChanged', item.data.id);	
				// redirect to list if new
				if(!oldId) {
					$state.go('project', {id: item.data.id});
				} else {
					window.alert('Saved');
				}
							
			});	
	}

	$scope.getLocation = function(val) {
	    return $http.get(settings.api + '/user/suggest', {
	      params: {
	        query: val
	      }
	    }).then(function(response){
	    	console.log(response);
	      return response.data.map(function(item){
	        return {name: item.displayName, picture: item.image.url, id: item.id};
	      });
	    });
	  };
  });
