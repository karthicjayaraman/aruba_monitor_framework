function appController($scope) {
    
    $scope.model = { dashboards: [] };
    
    //To Do: Get it from backend
    for (var i = 0; i < 5; i++) {
        $scope.model.dashboards.push({name:'dashboard_' + i, description: "Dashboard " + i});
    }

    this.$init($scope); //, $scope.initDashboard);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
appController.$inject = ['$scope'];