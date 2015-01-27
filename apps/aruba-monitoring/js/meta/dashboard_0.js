ScreenMetaData = {
    view: 'dashboard_0',
    metainfo: {
        view: 'dashboard_0',
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
                var traffic = [];
                for (var i = 0; i < data.facets[0].entries.length; i++) {
                    var item = data.facets[0].entries[i];
                    traffic.push([item.time, item.count]);
                }
                scope.model.traffic = traffic;
            }
        }
    },
    panels: {
        row1: {
            children: {
                counters_section: {
                    attr: { class: 'counters' },
                    children: {
                        counter0: {
                            attr: {class : 'counter-box boxColor'},
                            children: {
                                ap_count: {
                                    content: '<label class="counter-title" id="ap_count" name="ap_count"><span>Access Point Count</span></label></br> <label class="count-view"><span ng-bind="model.ap_count"></span></label>',
                                    afterRender: function (scope, meta, parentEl, confg, options) {
                                        scope.$doPefromAction(null, (meta.name || meta.id), scope, 'task_ap_count');
                                    }
                                }
                            }
                        },

                        counter1: {
                            attr: { class: 'counter-box boxColor' },
                            children: {
                                station_count: {
                                    content: '<label class="counter-title" id="station_count" name="station_count"><span>Station Count</span></label></br> <label class="count-view"><span ng-bind="model.station_count"></span></label>',
                                    afterRender: function (scope, meta, parentEl, confg, options) {
                                        scope.$doPefromAction(null, (meta.name || meta.id), scope, 'task_st_count');
                                    }
                                }
                            }
                        },

                        counter2: {
                            attr: { class: 'counter-box boxColor' },
                            children: {
                                app_count: {
                                    content: '<label class="counter-title" id="app_count" name="app_count"><span>Application Count</span></label></br> <label class="count-view"><span ng-bind="model.app_count"></span></label>',
                                    afterRender: function (scope, meta, parentEl, confg, options) {
                                        scope.$doPefromAction(null, (meta.name || meta.id), scope, 'task_app_count');
                                    }
                                }
                            }
                        }
                    }
                },

                traffic: {
                    type: 'chartpanel',
                    controltype: 'highchart',
                    template: 'highchart',
                    model: 'traffic',
                    config: {
                        /*rangeSelector: {
                            selected: 1
                        },*/
                        "series": [
                          {
                              "name": "Bytes",
                              "data": [],
                              "type": "line"
                          }
                        ],
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
                            title: {
                                text: ''
                            }
                        }
                    },
                    afterRender: function (scope, meta, parentEl, confg, options) {
                        scope.$doPefromAction(null, (meta.name || meta.id), scope, 'task_traffic');
                    }
                }
            }
        }
    }
}