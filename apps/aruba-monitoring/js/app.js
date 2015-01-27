
/**
 * Setting up angular application and list of dependency modules 
 * @ui.router - Angular state provider
 * @ngViewBuilder - Generate dynamic html view from JSON and TPL
 * @ngGrid - Data grid
 * @angles - Angular directive for Chart.js
 * @leaflet-directive - Angular directive for leaflet
 * @ui.bootstrap - Angular ported bootstrap 
 */
window[appName] = angular.module(appName, ['ui.router',
                                           'ngViewBuilder',
                                           'ngGrid',
                                           'angles',
                                           'leaflet-directive',
                                           'highcharts-ng',
										   'd3js-ng',
                                           'ui.grid'
]);
