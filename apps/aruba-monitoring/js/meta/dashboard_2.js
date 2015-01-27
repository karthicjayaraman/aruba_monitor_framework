ScreenMetaData = {
    view: 'dashboard_2',
    metainfo: {
        view: 'dashboard_2',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },
    actions: {
        task_ap_count: {
            type: 'post',
            url: 'http://10.29.23.19:9200/_all/_search?pretty',
            resultPath: "['facets']['0']['count']",
            resultModelPath: "ap_count",
            onBefore: function (scope, ops) {
                ops.data = { "facets": { "0": { "query": { "filtered": { "query": { "query_string": { "query": "SourceType:ArubaAccessPoint" } }, "filter": { "bool": { "must": [{ "match_all": {} }] } } } } } }, "size": 0 };
                return true;
            }
        },
        task_st_count: {
            type: 'post',
            url: 'http://10.29.23.19:9200/_all/_search?pretty',
            resultPath: "['facets']['0']['count']",
            resultModelPath: "station_count",
            onBefore: function (scope, ops) {
                ops.data = { "facets": { "0": { "query": { "filtered": { "query": { "query_string": { "query": "SourceType:ArubaStation" } }, "filter": { "bool": { "must": [{ "match_all": {} }] } } } } } }, "size": 0 };
                return true;
            }
        },
        task_app_count: {
            type: 'post',
            url: 'http://10.29.23.19:9200/_all/_search?pretty',
            resultPath: "['facets']['0']['count']",
            resultModelPath: "app_count",
            onBefore: function (scope, ops) {
                ops.data = { "facets": { "0": { "query": { "filtered": { "query": { "query_string": { "query": "SourceType:ArubaVisibilityRec AND NOT app:App_error" } }, "filter": { "bool": { "must": [{ "match_all": {} }] } } } } } }, "size": 0 };
                return true;
            }
        },
        task_traffic: {
            type: 'post',
            url: 'http://10.29.23.19:9200/_all/_search?pretty',
            onBefore: function (scope, ops) {
                ops.data = { "facets": { "0": { "date_histogram": { "key_field": "@timestamp", "value_field": "total_byts", "interval": "5m" }, "global": true, "facet_filter": { "fquery": { "query": { "filtered": { "query": { "query_string": { "query": "SourceType:ArubaVisibilityRec AND NOT app:App_error" } }, "filter": { "bool": { "must": [{ "match_all": {} }] } } } } } } } }, "size": 0 };
                return true;
            },
            onComplete: function (scope, data) {
                console.log(data);
                var traffic = [], gridData = [];
                for (var i = 0; i < data.facets[0].entries.length; i++) {
                    var item = data.facets[0].entries[i];
                    traffic.push([item.time, item.count]);
                    gridData.push({'#': (i+1), time: item.time, count: item.count});

                }
                scope.model.traffic = traffic;
                scope.model.gridData = gridData;
            }
        }
    },
    panels: {
        row1: {
            children: {
                counter_panel: {
                    attr: { class: 'counters' },
                    template: "panel",
                    children: {
                        counter0: {
                            template: 'box',
                            title: 'Access Point Count',
                            model: 'ap_count',
                            afterRender: "task_ap_count"
                        },
                        counter1: {
                            template: 'box',
                            title: 'Station Count',
                            model: 'station_count',
                            afterRender: "task_st_count"
                        },
                        counter2: {
                            template: 'box',
                            title: 'Application Count',
                            model: 'app_count',
                            afterRender: "task_app_count"
                        }
                    }
                },
                traffic_panel: {
                        template: "panel",
                        title: "Traffic",
                        subtitle: 'Day wise usage',
                        children: {
                        traffic: {
                            type: 'chartpanel',
                            template: 'highchart',
                            model: 'traffic',
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
                                    title: { text: '' }
                                    }
                            },
                            afterRender: 'task_traffic'
                        }
                    }
                },

                nggrid_panel: {
                    template: "panel",
                    title: "ngGrid",
                    children: {
                        ng_grid: {
                            type: 'gridpanel',
                            template: 'ng-grid',
                            
                            config: { data: 'model.gridData' }
                        }
                    }
                },

                uigrid_panel: {
                    template: "panel",
                    title: "uiGrid",
                    children: {
                        ng_grid: {
                            type: 'gridpanel',
                            template: 'ui-grid',
                            config: { data: 'model.gridData' }
                        }
                    }
                }
            }
        }
    }
}