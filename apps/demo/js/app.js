/**
 * Setting up angular application and list of dependency modules 
 * @ui.router - Angular state provider
 * @ngViewBuilder - Generate dynamic html view from JSON and TPL
 * @ngGrid - Data grid
 * @angles - Angular directive for Chart.js
 * @leaflet-directive - Angular directive for leaflet
 * @ui.bootstrap - Angular ported bootstrap 
 */
window[window.appName] = angular.module(window.appName, ['ui.router',
                                           'ngViewBuilder',
                                           'ngGrid',
                                           'angles',
                                           'leaflet-directive',
                                           'ui.bootstrap',
                                           'highcharts-ng'
]);

/**
 * Define some of usefull provider to work with lazy loading
 */
window[window.appName].config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
    window[window.appName].register =
        {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };
}]);
