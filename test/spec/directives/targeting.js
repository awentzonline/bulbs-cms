'use strict';

describe('Directive: targeting', function () {

  // load the directive's module
  beforeEach(module('bulbsCmsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<targeting></targeting>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the targeting directive');
  }));
});