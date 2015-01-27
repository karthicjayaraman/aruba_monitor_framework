//Default template
var viewTemplate = '<div id="screen-{{view}}" name="screen-{{view}}"><p class="text-center progress"><span class="label label-info">Please wait, I am building view...</span></p></div>';


/**
 * Configure application routing to takecare of navigation
 **/
window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    
    /**
	 * Read more on http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	 **/
    //Used for ui-view (Nested views)
    $urlRouterProvider.otherwise('/' + appName + '/dashboard');

    $stateProvider.state(appName, {
        url: '/' + appName,
        templateUrl: 'views/home.html',
        controller: 'appController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load(appName, '../js/controllers/app', 'appController', true);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'lookupController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('lookup', '../js/controllers/lookup', 'lookupController', true);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.dashboard_0', {
        url: '/dashboard_0',
        template: viewTemplate.replace(/{{view}}/g, 'dashboard_0'), //templateUrl: 'views/overview.html',
        controller: 'defaultController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('dashboard_0', '../js/controllers/default', 'defaultController', false);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.dashboard_1', {
        url: '/dashboard_1',
        template: viewTemplate.replace(/{{view}}/g, 'dashboard_1'), //templateUrl: 'views/overview.html',
        controller: 'defaultController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('dashboard_1', '../js/controllers/default', 'defaultController', false);
            }]
        }
    });
}]);

window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state(appName + '.dashboard_2', {
        url: '/dashboard_2',
        template: viewTemplate.replace(/{{view}}/g, 'dashboard_2'), //templateUrl: 'views/overview.html',
        controller: 'defaultController',
        resolve: {
            load: ['$ngViewLoader', function ($ngViewLoader) {
                return $ngViewLoader.load('dashboard_2', '../js/controllers/default', 'defaultController', false);
            }]
        }
    });
}]);