function defaultController($scope) {
    
    $scope.doPrepareRequest = function (ops) {

        ops.rawRequest = "";
        ops.data = "";

    }


    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
defaultController.$inject = ['$scope'];