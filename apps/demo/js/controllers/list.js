function listController($scope) {
    
    $scope.model = {
                grid: [{ name: "Moroni", age: 50 },
                        { name: "Tiancum", age: 43 },
                        { name: "Jacob", age: 27 },
                        { name: "Nephi", age: 29 },
                        { name: "Enos", age: 34 }],
                samplechart: [{
                                    value: 300,
                                    color: "#F7464A",
                                    highlight: "#FF5A5E",
                                    label: "Red"
                                },
                                {
                                    value: 50,
                                    color: "#46BFBD",
                                    highlight: "#5AD3D1",
                                    label: "Green"
                                },
                                {
                                    value: 100,
                                    color: "#FDB45C",
                                    highlight: "#FFC870",
                                    label: "Yellow"
                                }]
            
    };

    $scope.handleUIEvents = function ($event, filedName, eventName) {
        
        console.log($scope.model);
    }
    
    $scope.doPrepareRequest = function (options) {
        //Prepare request

        return $scope.model;
    }

    $scope.doParseResponse = function (data, options, hasError) {
        //Parse response
        if (hasError)
            return;

        $scope.model = data;
    }

    this.$init($scope);
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
listController.$inject = ['$scope', '$compile'];