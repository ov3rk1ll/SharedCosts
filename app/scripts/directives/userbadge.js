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
      template: '<span class="label label-default"><img ng-src="{{ user.picture }}" alt="{{ user.name }}" class="img-circle" style="max-height: 18px;"> {{ user.name }}</span>',
      restrict: 'E',
      scope: { user: '=' }
    };
  });
