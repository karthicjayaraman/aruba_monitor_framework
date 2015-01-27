function homeController($scope) {
    $scope.model = { moduleName: "Home" }
    
    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
homeController.$inject = ['$scope'];