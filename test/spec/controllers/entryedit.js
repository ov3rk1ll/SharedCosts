'use strict';

describe('Controller: EntryeditCtrl', function () {

  // load the controller's module
  beforeEach(module('sharedcostApp'));

  var EntryeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntryeditCtrl = $controller('EntryeditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
