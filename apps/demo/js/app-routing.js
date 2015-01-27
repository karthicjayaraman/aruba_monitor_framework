/**
 * Configure application routing to takecare of navigation
 **/
window[appName].config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    //Default template
    var viewTemplate = '<div id="screen-{{view}}" name="screen-{{view}}"><p class="text-center progress"><span class="label label-info">Please wait, I am building view...</span></p></div>';

    /**
	 * Read more on http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	 **/
    //Used for ui-view (Nested views)
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/dashboard/home.html',
            controller: 'homeController',
            resolve: {
                load: ['$ngViewLoader', function ($ngViewLoader) {
                    return $ngViewLoader.load('home', '../js/controllers/home', 'homeController', true);
                }]
            }
        })
        // nested list with custom controller
		.state('home.list', {
		    url: '/list',
		    template: viewTemplate.replace(/{{view}}/g, 'list'),
		    controller: 'listController',
		    resolve: {
		        load: ['$ngViewLoader', function ($ngViewLoader) {
		            return $ngViewLoader.load('list', ['../js/controllers/list', '../js/controllers/list-tab-highchart'], 'listController');
		        }]
		    }
		})
		.state('home.detail', {
		    url: '/detail',
		    template: viewTemplate.replace(/{{view}}/g, 'detail'),
		    controller: 'detailController',
		    resolve: {
		        load: ['$ngViewLoader', function ($ngViewLoader) {
		            return $ngViewLoader.load('detail', '../js/controllers/detail', 'detailController');
		        }]
		    }
		});
}]);
