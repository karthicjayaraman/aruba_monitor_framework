function lookupController($scope, $ngViewBuilder) {

    ////////////////////////// Model and Context /////////////////////////////////
    $scope.model = {
        userQueryText: 'SourceType',
        displayMode: 'raw', /*raw / custom*/
        visualIndex: '', /* Control Type*/
        controlTypes: supportedControls,
    };

    $scope.selected_terms = [];
    $scope.arrTableData = [];
    var tempEvent = null;

    ////////////////////////// Event handling and watchers ///////////////////////
    $scope.changeDisplayMode = function (mode) {
        $scope.model.displayMode = mode || 'raw';
    }

    $scope.handleChange = function (type) {
        switch (type) {
            case "sourcetype":
                $scope.model.userQueryText += $scope.model.suggestedValue[0];
                break;
        }

        $scope.showSuggestion = false;
    }


    $scope.toggleSelection = function toggleSelection(term) {

        var idx = $scope.selected_terms.indexOf(term);

        if (idx > -1) {
            $scope.selected_terms.splice(idx, 1);
        }


        else {
            $scope.selected_terms.push(term);
        }

    }

  

    $scope.doSubmit = function () {

        var parameterForTableFields = {
            "size": 20,
            "query": {
                "filtered": {
                    "filter": {
                        "bool": {
                            "must": [{"term": {"SourceType": "arubastation"}}],
                            "must_not": [],
                            "should": []
                        }
                    }
                }
            },
            "fields": $scope.selected_terms
        };

        var action = {
            name: 'tableFields',
            type: 'post',
            url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
            data: parameterForTableFields
        }
        if (action) {
            $scope.$prepareAndExecute($scope, tempEvent, null, action, action.name);
        }

        $scope.showUserSettingsPopup = false;

    }


    var parseChartFields = function (data) {

        var traffic = [], gridData = [];

        for (var i = 0; i < data.facets[0].entries.length; i++) {
            var item = data.facets[0].entries[i];
            traffic.push([item.time, item.count]);
            gridData.push({'#': (i + 1), time: item.time, count: item.count});

        }

        $scope.model.defaultModel = traffic;
        //var controlDef = $scope.model.controlTypes[1];
        //$scope.renderVisualComponent(controlDef);
    }

    var parseFields = function (data) {


        var tempArray1 = data.hits.hits;
        var tempArrayForTableData = [];
        for (var i = 0; i < tempArray1.length; i++) {
            var a = tempArray1[i];
            var b = a.fields;
            var arrayForKeys = $scope.selected_terms;
            var tempDic = {};
            for (var j = 0; j < arrayForKeys.length; j++) {
                var key = arrayForKeys[j];
                var value = "";
                if (b[key])
                    value = b[key][0];
                tempDic[key] = value;
            }
            tempArrayForTableData.push(tempDic);
        }
        $scope.arrTableData = tempArrayForTableData;
        var controlDef = $scope.model.controlTypes[0];
        $scope.renderVisualComponent(controlDef);
    }


    $scope.getVisualization = function (type) {

        $scope.templateUrl = "templates/" + $scope.model.controlTypes[type].popup_template + ".html";

        $scope.showUserSettingsPopup = true;

    }


    $scope.doChart = function () {

        var param = {
            "facets": {
                "0": {
                    "date_histogram": {
                        "key_field": "@timestamp",
                        "value_field": "total_byts",
                        "interval": "5m"
                    },
                    "global": true,
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {"query_string": {"query": "SourceType:ArubaVisibilityRec AND NOT app:App_error"}},
                                    "filter": {"bool": {"must": [{"match_all": {}}]}}
                                }
                            }
                        }
                    }
                }
            }, "size": 0
        };

        var action = {
            name: 'ChartFields',
            type: 'post',
            url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
            data: param
        }
        if (action) {
            $scope.$prepareAndExecute($scope, tempEvent, null, action, action.name);
        }

        $scope.showUserSettingsPopup = false;

    }


    $scope.doCancel = function () {

        $scope.showUserSettingsPopup = false;

    }

    $scope.$watch("model.visualIndex", function (newValue, oldValue) {

        if (newValue == oldValue)
            return;

        var controlDef = $scope.model.controlTypes[newValue];
        $scope.renderVisualComponent(controlDef);

    });

    $scope.lookUp = function ($event) {
        var action = null;
        tempEvent = $event;
        if ($scope.model.userQueryText.length != 0) {
            if ($event.keyCode != 13) {
                var terms = $scope.model.userQueryText.toLowerCase().split('sourcetype');

                if ($scope.model.userQueryText.toLowerCase() == 'sourcetype' || $scope.model.userQueryText.toLowerCase() == 'sourcetype=' || terms[terms.length - 1] == '=' || terms[terms.length - 1] == '') {

                    action = {
                        name: 'sourcetypes',
                        type: 'post',
                        url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                        data: {
                            "_source": false,
                            "size": 0,
                            "query": {"query_string": {"query": "SourceType:*"}},
                            "aggs": {"sourcetypes": {"terms": {"field": "SourceType", "size": 0}}}
                        }
                    }
                }
            }
            else if ($event.keyCode == 13) {
                var sourceTypes = $scope.model.userQueryText.split(' '),
                    sourceTypeValues = sourceTypes[0].split('=');
                var data = postTheSearchText(sourceTypes);
                action = {
                    name: data.name,
                    type: 'post',
                    url: 'http://10.29.23.18:9200/_all/_search?pretty=1',
                    data: data.parameter
                }
            }
            else {
            }
            if (action) {
                $scope.$prepareAndExecute($scope, $event, null, action, action.name);
            }
        }
    }

    ////////////////////////// Request / Response Handlers ///////////////////////
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
                if (data)
                    processTheData(data);
                break;

            //tableFields
            case "tableFields":
                $scope.showSuggestion = false;
                if (data)
                    parseFields(data);
                break;

            case "ChartFields":
                $scope.showSuggestion = false;
                if (data)
                    parseChartFields(data);
                break;

                break;


        }
    }

    this.$init($scope);

    /////////////////////////////////// Uitility / Supporting methods //////////////////

    /**
     * Prepare JSON schema and render visual element
     */
    $scope.renderVisualComponent = function (visualObject) {
        var controlConfig = null;

        switch (visualObject.basetype) {
            case "gridpanel":
                $scope.model.defaultModel = angular.copy($scope.arrTableData);
                controlConfig = {
                    compile: true,
                    id: 'default_panel',
                    template: "panel",
                    title: visualObject.desc || "Table View",
                    children: {
                        default_table: {
                            type: 'gridpanel',
                            template: visualObject.template,
                            config: {data: 'model.defaultModel'}
                        }
                    }
                }
                break;

            case "mappanel":
                break;
				
			case "d3jsbarpanel":
				 $scope.model.defaultModel = [10,20,30,40,50];
				 controlConfig = {
					  compile: true,
					  id: 'default_panel',
					  template:"panel",
					  title: "D3 JS",
					  subtitle: 'D3 JS Bar',
					  	children: {
							d3js:{
								type: 'd3jsbarpanel',
							    template: 'd3js',
							 	config: {data: $scope.model.defaultModel}
						 }	  
					 }
				 }
			break;

            case "chartpanel":
                $scope.model.defaultModel = angular.copy($scope.traffic);

                controlConfig = {
                    compile: true,
                    id: 'default_panel',
                    template: "panel",
                    title: "Traffic",
                    subtitle: 'Day wise usage',
                    children: {
                        traffic: {
                            type: 'chartpanel',
                            template: 'highchart',
                            model: 'model.defaultModel',
                            config: {
                                series: [{
                                    "name": "Bytes",
                                    "data": [],
                                    "type": "line"
                                }],
                                title: 'Traffic',
                                xAxis: {
                                    type: 'datetime',
                                    labels: {
                                        format: '{value:%Y-%m-%d}',
                                        rotation: 60,
                                        align: 'left'
                                    }
                                },
                                yAxis: {
                                    title: {text: ''}
                                }
                            }
                        }
                    }
                }

                break;

            case "formpanel":
                break;

            case "box":
                break;
        }

        angular.element('#user_control_container').html("");
        if (controlConfig) {

            $ngViewBuilder.buildControl($scope, controlConfig, angular.element('#user_control_container'), "defaultModel", $scope.model);

            console.log($scope.model.defaultModel);
        }
    }


    /**
     * ??
     * To Do: Make it as angular service or method
     */
    function processTheData(data) {
        var arrHits = data.hits.hits;
        var tempArrRawData = [];
        var tempArrTableData = [];
        for (var i = 0; i < arrHits.length; i++) {
            var a = arrHits[i];
            var b = a._source;
            tempArrRawData.push(b.message);
            delete b.message;
            tempArrTableData.push(b);
        }
        var tempDic1 = data.hits.hits[0]._source;
        $scope.terms = Object.keys(tempDic1)
        $scope.events = tempArrRawData;
        $scope.arrayForTableData = tempArrTableData;
    }

    /**
     * ??
     * To Do: Make it as angular service / factory
     */
    function postTheSearchText(arrSearchTerms) {
        var data = {};
        data.name = "lookup";
        data.parameter = {};

        var arrSourceTypeTerm = arrSearchTerms[0].split('=');
        if (arrSourceTypeTerm.length > 1) {
            var strSourceType = arrSourceTypeTerm[1];

            //Construct the Query Parameters
            data.parameter.size = 20;
            data.parameter.query = {};
            data.parameter.query.filtered = {};
            data.parameter.query.filtered.filter = {};
            data.parameter.query.filtered.filter.bool = {};
            //Parameter for 'AND' condition
            data.parameter.query.filtered.filter.bool.must = [];
            data.parameter.query.filtered.filter.bool.must.push({"term": {"SourceType": strSourceType}});//Put the Sourcetype
            //Parameter for 'NOT' condition
            data.parameter.query.filtered.filter.bool.must_not = [];
            //Parameter for 'OR' condition
            data.parameter.query.filtered.filter.bool.should = [];

            //To Do -> Chart Creation
            var chartType = 0;
            var chartParameters = {};

            //Parse the every term
            for (var i = 1; i < arrSearchTerms.length; i++) {
                var component = arrSearchTerms[i];
                if (typeof (component) != "undefined" && component.length != 0 && component.length > 2) {
                    if (component.indexOf("NOT") != -1 || component.indexOf("AND") != -1) {
                        var subComponent = component.substring(4, component.length - 1);
                        var arrayOfTerms = subComponent.split('=');
                        if (arrayOfTerms.length != 0) {
                            var stringOfField = arrayOfTerms[0];
                            var stringOfValue = arrayOfTerms[1];
                            var tempDic = {};
                            tempDic.term = {};
                            tempDic.term[stringOfField] = stringOfValue;
                            if (component.indexOf("NOT") != -1)
                                data.parameter.query.filtered.filter.bool.must_not.push(tempDic);
                            else
                                data.parameter.query.filtered.filter.bool.must.push(tempDic);
                        }
                    }
                    else if (component.indexOf("|table") != -1)//For Table Chart Type = 1
                    {
                        data.name = "table";
                        //Get the Column list which to be displayed
                        var subComponent = component.substring(7, component.length - 1);
                        //parse the columns and make them aggregation
                        var columns = subComponent.split(',');
                        chartParameters.tableColumns = columns;
                    }
                    else if (component.indexOf("|pie") != -1)//For Pie Chart Type = 2
                    {
                        data.name = "pie";
                        var subComponent = component.substring(5, component.length - 1);
                        data.parameter.aggs = {"0": {"terms": {"field": subComponent}}};
                    }
                    else {
                        var arrayOfTerms = component.split('=');
                        if (arrayOfTerms.length != 0) {
                            var stringOfField = arrayOfTerms[0];
                            var stringOfValue = arrayOfTerms[1];
                            var tempDic = {};
                            tempDic.term = {};
                            tempDic.term[stringOfField] = stringOfValue;
                            data.parameter.query.filtered.filter.bool.should.push(tempDic);
                        }
                    }
                }
                else {
                    console.log("Please check your Search query");
                }
            }
        }
        else {
            console.log("SourceType is missing");
        }
        console.log("The Resultant Parameter :\n" + data.parameter.query);
        return data;
    }

}

//Required to support minification https://code.angularjs.org/1.2.22/docs/tutorial/step_05
lookupController.$inject = ['$scope', '$ngViewBuilder'];