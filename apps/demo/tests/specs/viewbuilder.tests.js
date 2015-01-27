describe('just checking', function() {

    var scope;//we'll use this scope in our tests

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module(window.appName));

    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('$viewBuilderController', { $scope: scope });
    }));

    it('Is controller ready?', function () {
        expect(scope.meta.view).toBe('Root');
    });
});
