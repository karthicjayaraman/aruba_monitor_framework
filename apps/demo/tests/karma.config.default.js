// Karma configuration
// Generated on Thu Sep 19 2013 12:08:36 GMT-0700 (PDT)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            '../../lib/jquery/jquery-2.1.1.min.js',
            '../../lib/bootstrap/bootstrap.min.js',
            '../../lib/angular/angular.js',
            '../../lib/angular/angular-ui-router.js',
            '../../lib/angular/angular-mocks.js',
            '../../lib/ngViewBuilder/ngViewBuilder.js',
            '../../lib/bootstrap/angular-ui/ui-bootstrap-tpls-0.11.0.min.js',
            '../../lib/grid/nggrid/ng-grid.debug.js',
            '../../lib/grid/nggrid/ng-grid-layout.js',
            '../../lib/charts/chartjs/*.js',
            '../../lib/charts/highcharts/highcharts-all.js',
            '../../lib/charts/highcharts/highcharts-ng.js',
            '../../lib/map/leaflet/leaflet.js',
            '../../lib/map/leaflet/angular-leaflet-directive.min.js',
            'app-config.default.js',
            '../js/app.js',
            'specs/*.js'
        ],

        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO || config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Firefox'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};