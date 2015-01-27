
/**
 * Application configuration
 * Define your appname and will be used as you app. Note: Any changes you do here will have impact on your app, so please do change in ng-app attribute to make your app run soomthly.
 * Relative library files path from this location
 */
window.appName = "angularApp";
window.appPath = {
    base: '',
    host: location.host,
    protocol: location.protocol,
    origin: location.origin,
    fw: '../../',
    lib: '../../lib/',
    tpl: '../lib/ngViewBuilder/tpl/'
};

console.log('App Name 1: ' + window.appName);