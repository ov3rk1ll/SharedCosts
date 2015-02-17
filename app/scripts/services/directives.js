'use strict';

/**
 * @ngdoc service
 * @name nautizadminApp.File
 * @description
 * # File
 * Factory in the nautizadminApp.
 */
angular.module('sharedcostApp')
  .factory('List', function($resource, settings){
        return $resource(settings.api + '/projects/:id', {id:'@id'}, {} );
  })
  .factory('Entry', function($resource, settings){
        return $resource(settings.api + '/projects/:projectId/entries/:id', {projectId:'@projectId', id: '@id'}, {} );
  });
