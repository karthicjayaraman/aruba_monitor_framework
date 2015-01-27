ScreenMetaData = {
    view: 'list',
    metainfo: { view: 'list',
        version: '1.0',
        date: 'Generated on dd/mm/yyyy'
    },
    actions: {
        save: { name: 'list/save', type: 'post'},
        fetch: { name:'list/fetch', type: 'get'}
    },

    options: {
        'gender': [{ key: 'M', value: 'Male' }, { key: 'F', value: 'Female' }]
    },

    panels: {
        row1: {
            attr: { class: 'row' },
            children: {
                column0: {
                    attr: { class: 'col-md-6 well' },
                    children: {
                        panel0: {
                            type: 'panel',
                            title: 'Grid using ngGrid',
                            children: {
                                grid: {
                                    type: 'gridpanel',
                                    template: 'ng-grid',
                                    controltype: 'ng-grid',
                                    config: {
                                        columnDefs: [
                                            { field: 'name', displayName: 'Name' },
                                            { field: 'age', displayName: 'Age' }
                                        ],
                                        enableCellSelection: true,
                                        enableRowSelection: false,
                                        enableCellEdit: true
                                    }
                                }
                            }
                        },
                        panel1: {
                            type: 'panel',
                            title: 'Chart using Chart.js (Angles)',
                            children: {
                                samplechart1: {
                                    type: 'chartpanel',
                                    controltype: 'chatjs',
                                    template: 'chartjs',
                                    model: 'samplechart',
                                    config: {
                                        type: 'Doughnut'
                                    }
                                }
                            }
                        },
                        panel2: {
                            type: 'panel',
                            title: 'Map using LeafletJs (angular-leaflet-directive)',
                            children: {
                                samplemap: {
                                    type: 'mappanel',
                                    controltype: 'leaflet',
                                    template: 'leaflet',
                                    config: {
                                        osloCenter: {
                                            lat: 59.91,
                                            lng: 10.75,
                                            zoom: 12
                                        },
                                        markers: {
                                            osloMarker: {
                                                lat: 59.91,
                                                lng: 10.75,
                                                message: "I want to travel here!",
                                                focus: true,
                                                draggable: false
                                            }
                                        },
                                        defaults: {
                                            scrollWheelZoom: false
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                column1: {
                    attr:{class:'col-md-6'},
                    children: {
                        panel3: {
                            type: 'panel',
                            title: 'Form Panel',
                            children: {
                                generalinfo: {
                                    type: 'form',
                                    children: {
                                        name: {
                                            type: 'text',
                                            label: 'Person Name',
                                            help: 'Legal name should be entered here',
                                            model: 'firstname',
                                        },
                                        age: {
                                            type: 'number',
                                            label: 'Age',
                                            help: 'Age',
                                            model: 'age'
                                        },
                                        gender: {
                                            type: 'select',
                                            label: 'Gender',
                                            help: 'Gender',
                                        },
                                        button1: {
                                            type: 'button',
                                            label: 'Submit',
                                            handle: 'handleUIEvents',
                                            attr: {class: 'pull-right', style: "margin-right: 15px;"},
                                            actions: ['save', 'fetch']
                                        }
                                    }
                                } //End of Gen Info
                            }
                        },
                        chartpanel1: {
                            type: 'panel',
                            title: 'Chart using Highcharts',
                            children: {
                                highchart1: {
                                    type: 'chartpanel',
                                    controltype: 'highchart',
                                    template: 'highchart',
                                    model: 'samplechart',
                                    config: {
                                        "options": {
                                            "chart": {
                                                "type": "areaspline"
                                            },
                                            "plotOptions": {
                                                "series": {
                                                    "stacking": ""
                                                }
                                            }
                                        },
                                        "series": [
                                          {
                                              "name": "Some data",
                                              "data": [
                                                1,
                                                2,
                                                4,
                                                7,
                                                3
                                              ],
                                              "id": "series-0",
                                              "type": "column"
                                          }
                                        ],
                                        "title": {
                                            "text": "Chart Sample 2"
                                        },
                                        "credits": {
                                            "enabled": true
                                        },
                                        "loading": false
                                    }
                                }
                            }
                        },
                        tabpannel1: {
                            type: 'tabpanel',
                            config: {
                                tabs: [{
                                        id: 'tab-1',
                                        title: 'Static Content',
                                        active: true,
                                        content: 'Text / HTML markup goes here' //type: 'static'
                                    },
                                    {
                                        id: 'tab-2',
                                        title: 'Template Content',
                                        contentURL: 'views/tpl/statichighchart.html', //type: 'dynamic' / 'template'
                                    },
                                    {
                                        id: 'tab-3',
                                        title: 'Dynamic Content', //type: 'dynamic' / 'template'
                                        children: {
                                            _name: {
                                                type: 'text',
                                                label: '_Person Name',
                                                help: 'Legal name should be entered here',
                                                model: 'firstname',
                                            }
                                        }
                                    }]
                            }
                        }
                    }
                }
            }
        }
    }
}