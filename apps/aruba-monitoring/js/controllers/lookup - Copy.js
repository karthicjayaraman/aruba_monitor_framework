function lookupController($scope) {
    
    $scope.model = { userQueryText: 'SourceType' };

    $scope.doPrepareRequest = function (ops) {
        return;
    }


    $scope.doParseResponse = function (data, ops, hasError) {
        console.log(data);

        switch (ops.name) {
            case "sourcetypes":
                //this should be set after getting response
                $scope.suggestions = angular.copy(data.aggregations.sourcetypes.buckets)
                $scope.showSuggestion = $scope.suggestions.length ? true : false;
                break;

            case "lookup":
                $scope.showSuggestion = false;
                //this should be set after getting response
                $scope.terms = ["a", "b", "c", "d"];
                $scope.events = [{ a: 'a1', b: 'b1', c: 'c1', d: 'd1' }, { a: 'a2', b: 'b2', c: 'c2', d: 'd2' }]
                break;
        }
    }


    $scope.lookUp = function ($event) {

        var action = null;

        if ($scope.model.userQueryText.length != 0) {
            if ($event.keyCode != 13) {

                var terms = $scope.model.userQueryText.toLowerCase().split('sourcetype');

                if ($scope.model.userQueryText.toLowerCase() == 'sourcetype' || $scope.model.userQueryText.toLowerCase() == 'sourcetype=' || terms[terms.length - 1] == '=' || terms[terms.length - 1] == '') {
                
                    action = {
                        name: 'sourcetypes',
                        type: 'post',
                        url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                        data: { "_source": false, "size": 0, "query": { "query_string": { "query": "SourceType:*" } }, "aggs": { "sourcetypes": { "terms": { "field": "SourceType", "size": 0 } } } }
                    }
                }
            }
            else if ($event.keyCode == 13) {
                
                var sourceTypes = $scope.model.userQueryText.split(' '),
                sourceTypeValues = sourceTypes[0].split('=');
                
                var data = getDataFromQuery($scope.model.userQueryText);

                action = {
                    name: 'lookup',
                    type: 'post',
                    url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                    data: data || { "_source": true, "size": 1, "query": { "query_string": { "query": "SourceType:" + sourceTypeValues[1] } }, "aggs": { "0": { "terms": { "field": "message.raw", "size": 20 } } } }
                }
            }

            if (action) {
                $scope.$prepareAndExecute($scope, $event, null, action, action.name);
            }
        }
    }

    $scope.updateQuery = function (index, type) {
        
        switch(type){
            case "sourcetype":
                $scope.model.userQueryText += $scope.suggestions[index].key;
                break;
        }

        $scope.showSuggestion = false;
    };

    this.$init($scope);

    ////////////////////////////////////////////////////////////////////////////////////
    function getDataFromQuery(userText) {
        return null;
    }
}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
lookupController.$inject = ['$scope'];