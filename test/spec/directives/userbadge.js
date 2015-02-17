'use strict';

describe('Directive: UserBadge', function () {

  // load the directive's module
  beforeEach(module('sharedcostApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-user-badge></-user-badge>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the UserBadge directive');
  }));
});
