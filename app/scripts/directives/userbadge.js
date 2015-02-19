'use strict';

/**
 * @ngdoc directive
 * @name sharedcostApp.directive:UserBadge
 * @description
 * # UserBadge
 */
angular.module('sharedcostApp')
  .directive('userbadge', function () {
    return {
      template: '<span class="userbadge"><img ng-src="{{ user.picture }}" alt="{{ user.name }}" class="img-circle" style="max-height: 18px;"> {{ user.name }}</span> ',
      restrict: 'E',
      scope: { user: '=' }
    };
  })
  .directive('bitpermissions', function($compile) {
	  return {
	    require: 'ngModel',
      	scope: { ngModel: '=' },
	    link: function(scope, element, attrs, ngModelController) {
	      ngModelController.$parsers.push(function(data) {
	      	var n = parseInt(scope.ngModel);
	      	if(data){
	      		n |= parseInt(attrs.bit);
	      	} else {
	      		n &= ~parseInt(attrs.bit);
	      	}
	        return n; //converted
	      });

	      ngModelController.$formatters.push(function(data) {
	        var x = parseInt(data) & parseInt(attrs.bit);
	        return x > 0 ? true : false;
	      });
	    }
	  }
});;
