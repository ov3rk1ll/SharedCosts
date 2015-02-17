'use strict';

describe('Service: waitingDialog', function () {

  // load the service's module
  beforeEach(module('sharedcostApp'));

  // instantiate service
  var waitingDialog;
  beforeEach(inject(function (_waitingDialog_) {
    waitingDialog = _waitingDialog_;
  }));

  it('should do something', function () {
    expect(!!waitingDialog).toBe(true);
  });

});
