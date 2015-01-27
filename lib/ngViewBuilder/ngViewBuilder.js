/**
 * A Template based Angular view builder module
 */
angular.module('ngViewBuilder', [])

/**
 * Preload required templates 
 */
.run(['$q', '$ngViewUtility', function ($q, $ngViewUtility) {
    
    //Preload and cache large templates

}])

.directive('ngViewBuild', ['$ngViewLoader', '$ngViewBuilder', function ($ngViewLoader, $ngViewBuilder) {
    return {
        restrict: 'EAC',
        link: function (scope, elm, attr, ctrl) {
            var schema = attr['schema'], viewname = attr["view"], async = attr['async'], replace = attr['replace'];

            schema = scope.$eval(schema) || schema;
            viewname = scope.$eval(viewname) || viewname;
            async = scope.$eval(async) || async;
           
            if (replace == 'true') {
                var pelm = elm.parent();
                elm.remove();
            }

            if (typeof schema == 'string') {
                $ngViewLoader.loadMeta(null, function (meta) { build(meta); }, null, schema, (async === true || async === 'true'));
            }
            else if (schema && typeof schema == 'object') {
                build(schema);
            }

            function build(meta) {
                meta = typeof meta === 'string' ? eval(meta) : meta;
                if (meta && meta.panels) {
                    var start = new Date();

                    $ngViewBuilder.build(scope, meta, (attr['id'] || attr['name']), replace == 'true' ? pelm : elm);

                    var end = new Date();
                    console.log("Total time taken to render partial / view '" + (viewname || meta.metainfo.view) + "' is '" + (end.getTime() - start.getTime()) + " ms'");
                }
            }
        }
    }
}])

/**
* Utility Service
*/
.service('$ngViewUtility', ['$rootScope', '$templateCache', '$http', '$q', '$log', function ($rootScope, $templateCache, $http, $q, $log) {
    this.getTemplate = function (template) {

        if (/<.+>/.test(template))
            $templateCache.put(template, template);
        else {
            $.ajax({
                type: "GET",
                url: (template.indexOf("/") != -1 ? '' : (window.appPath.tpl || (window.appPath.lib + 'ngViewBuilder/tpl/'))) + template + '.html',
                async: false
            }).success(function (content) {
                $templateCache.put(template, content)
            });
        }
        return $templateCache.get(template) || "<div> Template content not found </div>";
    };

    this.getTemplateFromCache = function (templateKey) {
        return $templateCache.get(templateKey) || this.getTemplate(templateKey);
    };

    this.getDefaultConfig = function(controlType, control, scope) {
        var defaultConfig = false;
        switch(controlType){
            case "chartjs":
                defaultConfig = {
                    // Boolean - Whether to animate the chart
                    animation: true,
                    // Number - Number of animation steps
                    animationSteps: 60,
                    // String - Animation easing effect
                    animationEasing: "easeOutQuart",
                    // Boolean - If we should show the scale at all
                    showScale: true,
                    // Boolean - If we want to override with a hard coded scale
                    scaleOverride: false,
                    // ** Required if scaleOverride is true **
                    // Number - The number of steps in a hard coded scale
                    scaleSteps: null,
                    // Number - The value jump in the hard coded scale
                    scaleStepWidth: null,
                    // Number - The scale starting value
                    scaleStartValue: null,
                    // String - Colour of the scale line
                    scaleLineColor: "rgba(0,0,0,.1)",
                    // Number - Pixel width of the scale line
                    scaleLineWidth: 1,
                    // Boolean - Whether to show labels on the scale
                    scaleShowLabels: true,
                    // Interpolated JS string - can access value
                    scaleLabel: "<%=value%>",
                    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
                    scaleIntegersOnly: true,
                    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                    scaleBeginAtZero: false,
                    // String - Scale label font declaration for the scale label
                    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Scale label font size in pixels
                    scaleFontSize: 12,
                    // String - Scale label font weight style
                    scaleFontStyle: "normal",
                    // String - Scale label font colour
                    scaleFontColor: "#666",
                    // Boolean - whether or not the chart should be responsive and resize when the browser does.
                    responsive: false,
                    // Boolean - Determines whether to draw tooltips on the canvas or not
                    showTooltips: true,
                    // Array - Array of string names to attach tooltip events
                    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
                    // String - Tooltip background colour
                    tooltipFillColor: "rgba(0,0,0,0.8)",
                    // String - Tooltip label font declaration for the scale label
                    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Tooltip label font size in pixels
                    tooltipFontSize: 14,
                    // String - Tooltip font weight style
                    tooltipFontStyle: "normal",
                    // String - Tooltip label font colour
                    tooltipFontColor: "#fff",
                    // String - Tooltip title font declaration for the scale label
                    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    // Number - Tooltip title font size in pixels
                    tooltipTitleFontSize: 14,
                    // String - Tooltip title font weight style
                    tooltipTitleFontStyle: "bold",
                    // String - Tooltip title font colour
                    tooltipTitleFontColor: "#fff",
                    // Number - pixel width of padding around tooltip text
                    tooltipYPadding: 6,
                    // Number - pixel width of padding around tooltip text
                    tooltipXPadding: 6,
                    // Number - Size of the caret on the tooltip
                    tooltipCaretSize: 8,
                    // Number - Pixel radius of the tooltip border
                    tooltipCornerRadius: 6,
                    // Number - Pixel offset from point x to tooltip edge
                    tooltipXOffset: 10,
                    // String - Template string for single tooltips
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
                    // String - Template string for single tooltips
                    multiTooltipTemplate: "<%= value %>",
                    // Function - Will fire on animation progression.
                    onAnimationProgress: function(){},
                    // Function - Will fire on animation completion.
                    onAnimationComplete: function(){}
                };
                break;

            default:
                break;
        }
        var userConfig = scope.getControlConfig ? scope.getControlConfig(control) : false;
        if (userConfig)
            return angular.extend(defaultConfig, userConfig);
        return defaultConfig;
    }
}])

/**
 * Angular view loader
 */
.service('$ngViewLoader', ['$rootScope', '$q', '$http', '$log', function ($rootScope, $q, $http, $log) {
	
	

    /**
     * Load module controller and initialize meta data
     */
    this.load = function (viewName, uri, controllerName, skipRendering) {
        if (!uri) {
            $log.warn("ngViewLoader - loadController: URI is not defined controller '" + controllerName + "' and view name '" + viewName + "'");
            return;
        }

        var defer = $q.defer();
        require(angular.isArray(uri) ? uri : [uri], function () {
            if (!controllerName)
                controllerName = viewName + 'Controller';

            //Get controller prototype
            var controller = (window[controllerName]);
            if (typeof controller == 'function') {
                //Meta info
                controller.prototype.$metaInfo = { view: viewName, controller: controllerName, controllerSrc: uri, loadedBy: 'loader' };
                //Init
                controller.prototype.$init = function (scope, initCallback, callBack) {
                    //Set meta information
                    scope.$appName = appName;
                    scope.$metainfo = this.$metainfo;

                    if (skipRendering === true) {
                        $log.info("ngViewBuilder - $init: User has set true to skip view building '" + controllerName + "' and view name '" + viewName + "'");
                        return;
                    }
                    scope.getScreenMeta(this.$metaInfo.view, function (metaData) {
                        if (!metaData)
                            return;
                        scope.schema = eval(metaData);
                        scope.schema.$metainfo = controller.prototype.$metaInfo;

                        if (initCallback)
                            initCallback(scope);
                        else {
                            scope.InitializeScreen(scope);
                            if (callBack)
                                callBack(scope)
                        }
                    });
                }
            }

            defer.resolve();
            $rootScope.$apply()
        });
        return defer.promise;
    };

    /**
     * Load view meta data and used for rendering dynamic view
     */
    this.loadMeta = function (viewName, callback, metaPath, url, sync) {
        url = url || ((metaPath ? metaPath: 'js/meta') + '/' + viewName + '.js');

        //sync load
        if (sync === true) {
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                contentType: 'application/json'
            })
            .success(callback)
            .error(function () {
                $log.warn("ngViewLoader - loadMeta: Failed load metadata '" + url + "'");
                callback();
            });
            return;
        }

        //async load
        $http({
                url: url,
                method: "GET",
                contentType: 'application/json'
            })
           .success(callback)
           .error(function () {
               $log.warn("ngViewLoader - loadMeta: Failed load metadata '" + url + "'");
               callback();
           });
        }
}])

/**
 * Angular view builder
 * To Do(s)
 * 1. Default options/config for ng-grid, chartjs, tabpanel
 * 2. Support to inbuilt validations and rules
 * 3. More templates and composite elements
 * 4. Optional Support - SmartTable, jqPlot, HighCharts, Google Maps
 * 5. Mock REST responder and request handler - Will be used for dev and not for productions
 * 6. Feasibility of setingup UTC in anyone of FW Karma, Grunt, Mocha...
 */
.service('$ngViewBuilder', ['$rootScope', '$templateCache', '$compile', '$interpolate', '$http', '$q', '$timeout', '$log', '$ngViewLoader', '$ngViewUtility', function ($rootScope, $templateCache, $compile, $interpolate, $http, $q, $timeout, $log, $ngViewLoader, $ngViewUtility) {
	
	

    /**
     * API exposed to module controller to build view
     * scope (angular scope) - Should be actual scope of controller
     */
    this.build = function (scope, schema, rootElName, rootEl) {
        schema = schema || scope.schema;
        if (!schema)
            return;

        if (!scope.model)
            scope.model = {};

        if (!scope.$schema)
            scope.$schema = { options: {}, config: {} };
        else {
            if (!scope.$schema.options)
                scope.$schema.options = {};
            if (!scope.$schema.config)
                scope.$schema.config = {};
        }

        if (!scope.$temp)
            scope.$temp = {};

        scope.$schema.options = angular.extend(scope.$schema.options, schema.options);
        
        scope.$schema.actions = angular.extend((scope.$schema.actions|| {}), schema.actions);
        scope.$schema.$metainfo = scope.$schema.$metainfo || schema.metainfo || { view: schema.view };

        if (!rootEl) {
            rootElName = rootElName || scope.$schema.elName || ('screen-' + (schema.metainfo.view || scope.$schema.$metainfo.view));
            rootEl = angular.element(rootElName ? '#' + rootElName : document.body);
        }
        
        try {
            buildInternal(scope, schema, schema, rootEl, scope.model);
            angular.element(".progress").css('display', 'none');
        }
        catch (e) {
            angular.element(".progress").html('<p class="text-center progress"><span class="label label-danger">' + (e.message || "Done with error! Failed to build view " + scope.$schema.$metainfo.view) + '</span></p>');
            $log.error(e);
        }
        
        //finally compile 
        $compile(rootEl.contents())(scope);

        delete scope.schema;
    };

    /////////////////////////////// Internal / Private methods ////////////////////////////
    /**
     * Init or return defined model
     */
    function getModel(control, model, isFormElement, defaultValue) {
        var modelPath = control.model || (isFormElement === true ? (control.model || control.name) : control.model)

        if (control.type != 'button' && control.noBind !== true && modelPath && modelPath.indexOf(".") == -1) {
            if (model && !model[modelPath])
                model[modelPath] = defaultValue;

            return modelPath;
        }
        return false;
    }
    
    /**
     * Set dom attributes from meta
     */
    function addAttributes(meta, htmlEl) {
        angular.forEach(meta.attr, function (attributeValue, attributeKey) {
            if (attributeKey == 'class' || attributeKey == 'cls')
                htmlEl.addClass(attributeValue);
            else
                htmlEl.attr(attributeKey, attributeValue);
        });
    }

    function buildInternal(scope, meta, key, parentEl, model) {

        angular.forEach(meta.panels, function (panel, key) {
            buildControlByType(scope, panel, key, parentEl, null, model);
        });
    }

    /**
     * Generic method - will redirects based on type
     */
    this.buildControl = function (scope, control, parentEl, dataPath, model) {

        if (!scope.$schema)
            scope.$schema = { options: {}, config: {} };
        else {
            if (!scope.$schema.options)
                scope.$schema.options = {};
            if (!scope.$schema.config)
                scope.$schema.config = {};
        }

        if (!scope.$temp)
            scope.$temp = {};

        buildControlByType(scope, control, "", parentEl, dataPath, model);
    }


    /**
     * Generic method - will redirects based on type
     */
    function buildControlByType(scope, control, key, parentEl, dataPath, model) {

        control.interpolateStartSymbol = "{{";
        control.interpolateEndSymbol = "}}";

        control.id = (control.id || control.name || key);
        if (!control.name)
            control.name = control.id;

        if (control.config)
            scope.$schema.config[control.name] = control.config;

        switch (control.type) {
            case "form":
                var modelPath = getModel(control, model, true, {});
                buildFormPanel(scope,
                               control,
                               key,
                               parentEl,
                               (dataPath ? dataPath + "." + modelPath : modelPath),
                               false,
                               model ? model[modelPath] : undefined);
                break;

            case "custom":
                var modelPath = getModel(control, model, false, {});
                if (typeof scope.buildFormElement != 'undefined')
                    scope.buildFormElement(scope,
                                           control,
                                           key,
                                           parentEl,
                                           modelPath ? (dataPath ? (dataPath + "." + modelPath) : modelPath) : (dataPath || modelPath),
                                           false,
                                           (modelPath && model) ? model[modelPath] : model);
                break;
          
            default:
                if ((control.type && /panel/.test(control.type) === false) || control.isFormField)
                    buildFormElement(scope, control, key, parentEl, dataPath, false, model);
                else {
                    var modelPath = getModel(control, model, false, {});
                    buildPanel(scope,
                                control,
                                key,
                                parentEl,
                                modelPath ? (dataPath ? (dataPath + "." + modelPath) : modelPath) : (dataPath || modelPath),
                                false,
                                (modelPath && model) ? model[modelPath] : model);
                }
                break;
        }
    }

    /**
     * Build panel / field of type unknown
     */
    function buildPanel(scope, control, key, parentEl, dataPath, isCallback, model) {

        var template = control.content || '<div id="{{id}}" name="{{name}}"></div>';

        if (!control.content && (control.template || control.type)) {
            template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
            if (!template)
                template = '<div id="{{id}}" name="{{name}}"></div>';
        }

        control.dataPath = dataPath || control.name;
        control.showTitle = (control.showTitle || control.title || control.label) ? true : false;
        if (!scope.$temp[control.name])
            scope.$temp[control.name] = {};

        var defaultConfig = $ngViewUtility.getDefaultConfig(control.controltype, control, scope);
        if (defaultConfig) {
            if (!scope.$schema.config[control.name])
                scope.$schema.config[control.name] = {};

            scope.$schema.config[control.name] = angular.extend(defaultConfig, scope.$schema.config[control.name]);
        }
        switch (control.type) {
            case "gridpanel":
                    if (!scope.$schema.config[control.name].data)
                        scope.$schema.config[control.name].data = ("model." + (dataPath ? dataPath : (control.model || control.name)))

                    if (!scope.$schema.config[control.name].selectedItems) {
                        scope.$temp[control.name].selectedItesm = [];
                        scope.$schema.config[control.name].selectedItems = scope.$temp[control.name].selectedItesm;
                        scope.$schema.config[control.name].plugins = [ngGridLayoutPlugin];
                    }
                    
                  
                    scope.$watch("model['" + (dataPath ? dataPath : (control.model || control.name)) + "']", function (newValue, oldValue) {
                        if (newValue != oldValue)
                            scope.$schema.config[control.name].data = newValue;
                    }, true);
                  
                    break

            case "chartpanel":
                control.config.height = control.config.height || '98%';
                control.config.width = control.config.width || '98%';
				
				 
              scope.$watch("model['" + (dataPath ? dataPath : (control.model || control.name)) + "']", function (newValue, oldValue) {
                    if (newValue != oldValue)
                        scope.$schema.config[control.name].series[0].data = newValue;
                });

                break;
			
			case "d3jsbarpanel":
				
				  if (!scope.$schema.config[control.name].data)
                        scope.$schema.config[control.name].data = ("model." + (dataPath ? dataPath : (control.model || control.name)))
				
				scope.$watch("model['" + (dataPath ? dataPath : (control.model || control.name)) + "']", function (newValue, oldValue) {
                        if (newValue != oldValue)
                            scope.$schema.config[control.name].data = newValue;
                    }, true);
					
					
			break;

            case "mappanel":
                break;

            case "tabpanel":
                control.handle = control.handle || "handleViewEvents";
                if (scope.$schema.config[control.name].tabs && scope.$schema.config[control.name].tabs.length) {
                    
                    angular.forEach(scope.$schema.config[control.name].tabs, function (tab) {
                        if (tab.children && !tab.content && !tab.contentURL) {
                            if (!$templateCache.get(tab.id + ".html")) {
                                var tabContentPanel = angular.element("<div></div>");
                                angular.forEach(tab.children, function (tabChild, tabChildName) {
                                    buildControlByType(scope, tabChild, tabChildName, tabContentPanel, dataPath, model);
                                });
                                $templateCache.put(tab.id + ".html", tabContentPanel.html());
                                delete tabContentPanel;
                            }
                        }
                    });
                }
                break;
        }

        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var panelEl = angular.element($interpolate(template)(control));

        addAttributes(control, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl));
        
        if (!control.content && control.children) {
            angular.forEach(control.children, function (childObject, childName) {
                buildControlByType(scope, childObject, childName, (panelEl.attr('id') !== control.id ? angular.element('#' + control.id, panelEl) : panelEl), dataPath, model);
            });
        }

        if (control.compile)
            $compile(panelEl.contents())(scope);

        if (typeof control.afterRender === 'string')
            scope.$doPefromAction(null, control.name || control.id, scope, control.afterRender);
        else if (typeof control.afterRender === 'function')
            control.afterRender(scope, control, panelEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, panelEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);
			
			console.log("The Schema Define 1"+JSON.stringify(scope.$schema.config, null, 4));

        parentEl.append(panelEl);
		
		console.log("The Schema Define 2"+JSON.stringify(scope.$schema.config, null, 4));
    }

    /**
     * Build form panel
     */
    function buildFormPanel(scope, control, key, parentEl, dataPath, isCallback, model) {

        var template = $ngViewUtility.getTemplateFromCache(control.template || control.type);
        if (!template)
            template = '<form id="{{id}}" name="{{name}}"></form>';
            
        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var formEl = angular.element($interpolate(template)(control));

        addAttributes(control, formEl);

        if (typeof control.afterRender === 'string')
            scope.$doPefromAction(null, control.name || control.id, scope, control.afterRender);
        else if (typeof control.afterRender === 'function')
            control.afterRender(scope, control, fromEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, formEl, scope.$schema.config[control.name], scope.$schema.options[control.name], scope);

        if (control.children) {
            angular.forEach(control.children, function (childObject, childName) {
                buildControlByType(scope, childObject, childName, formEl, dataPath, model);
            });
        }

        if (control.compile)
            $compile(formEl.contents())(scope);

        parentEl.append(formEl);
    }

    /**
     * Build leaf element (i.e., fields like text, select, checkbox...)
     */
    function buildFormElement(scope, control, key, parentEl, dataPath, isCallback, model) {

        control.dataPath = dataPath ? dataPath : '';

        var templateType = control.template || control.type;

        control.handle = control.handle || 'handleViewEvents';

        var modelPath = getModel(control, model, (control.type != 'button' && control.noBind !== true), typeof control.defaultValue != 'undefined' ? control.defaultValue : null);
        if (model && modelPath) {
            model[modelPath] = model[modelPath] || null;
            control.dataPath += (control.dataPath ? "." : "") + modelPath;
        }

        if (control.actions) {
            if(!scope.$schema.config[control.name])
                scope.$schema.config[control.name] = {};

            scope.$schema.config[control.name].actions = control.actions;
        }
        
        switch (control.type) {
            case 'password':
            case 'number':
                templateType = 'text';
                break

            case "date":
                scope.$schema.config[control.name].format = scope.$schema.config[control.name].format || 'dd/MM/yyyy';
                scope.$schema.config[control.name].closeText = scope.$schema.config[control.name].closeText || 'Close';
                break;

            case "datepicker":
                if (!control.config)
                    control.config = {};
                control.config.showWeeks = control.config.showWeeks || false;
                control.config.height = control.config.height || 250;
                break;

            case "select":
            case "multiselect":
                control.optionsKey = control.optionsKey || "$schema.options." + control.name;
                control.optionKey = control.optionKey || 'key';
                control.optionValue = control.optionValue || 'value';
                break;

            case "checkbox":
            case "radio":
                
                control.hasOptions = control.hasOptions || scope.$schema.options[control.name] ? true : false;
                if (control.hasOptions) {
                    control.optionsKey = control.optionsKey || "$schema.options." + control.name;
                    control.optionKey = control.optionKey || 'key';
                    control.optionValue = control.optionValue || 'value';
                }

                if (model) {
                    if (control.type === 'checkbox') {

                        model[modelPath] = [];
                        angular.forEach(scope.$schema.options[control.name], function () {
                            model[modelPath].push(false);
                        });
                    }
                }
                break;

            default:
                break;
        }

        var template = $ngViewUtility.getTemplateFromCache(templateType);
        if (!template)
            template = "<p> Template '" + templateType + ".html' not found!<p>"
            
        if (typeof scope.beforeRender === 'function')
            scope.beforeRender(control.id, control, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        var fieldEl = $interpolate(template)(control);
        if (control.compile)
            $compile(fieldEl.contents())(scope);

        parentEl.append(fieldEl);
        addAttributes(control, angular.element('#' + control.id, parentEl));

        if (typeof control.afterRender === 'string')
            scope.$doPefromAction(null, control.name || control.id, scope, control.afterRender);
        else if (typeof control.afterRender === 'function') 
            control.afterRender(scope, control, fieldEl, scope.$schema.config[control.name], scope.$schema.options[control.name]);

        if (typeof scope.afterRender === 'function')
            scope.afterRender(control.id, control, fieldEl, scope.$schema.config[control.name], scope.$schema.options[control.name], scope);
        return;
    }
}]).controller('$viewBuilderController', ['$rootScope', '$scope', '$http', '$ngViewBuilder', '$ngViewLoader', '$location', '$parse', '$window', function ($rootScope, $scope, $http, $ngViewBuilder, $ngViewLoader, $location, $parse, $window) {

    //Keep something in global (i.e.,not in $rootScope)
    $scope.meta = {
        name: "Demo Application",
        version: '0.1',
        author: 'Murugesan G',
        date: 'Jul 2014',
        view: 'Root'
    };

    /*************************************************** Handle screen initialization and build view *************************************************/
    /**
    * Base API which will gets view meta info. from backend
    * @viewName (String) - View Name
    * @callback (function) - Callback function to process meta data
    */
    $scope.getScreenMeta = function (viewName, callback) {
        $ngViewLoader.loadMeta(viewName, callback, "js/meta");
    }

    /**
    * Base API which will takes view meta as input and sends it to formbuilder to generate view
    * @scope (Object) - View scope
    */
    $scope.InitializeScreen = function (scope) {
        var start = new Date();

        $ngViewBuilder.build(scope);

        var end = new Date();
        console.log("Total time taken to render view '" + (scope.$schema.$metainfo.view) + "' is '" + (end.getTime() - start.getTime()) + " ms'");
    }

    /************************************************************ Handle DOM actions ****************************************************************/
    /**
     * DOM action handler
     */
    $scope.$doPefromAction = function ($event, elementName, scope, actionToExecute, isInit, isFetch) {

        if (!scope && !$event)
            return;

        if (!scope && $event)
            scope = angular.element($event.target || ('#' + elementName)).scope()
        
        if (!scope)
            scope = $scope;


        var actions = scope.$schema ? scope.$schema.actions : (scope.schema ? scope.schema.actions : false);

        if (actions) {
            angular.forEach(actions, function (action, actionName) {

                if ((isInit === true && action.isInit === true) || (isFetch === true && action.isFetch === true) || (actionToExecute && actionToExecute === (action.name || actionName)))
                    $scope.$prepareAndExecute(scope, $event, elementName, action, (action.name || actionName));
            });
        }
        else if (scope.$schema && scope.$schema.config[elementName]) {

            angular.forEach(scope.$schema.config[elementName].actions, function (actionName) {

                var action = scope.$schema.actions ? scope.$schema.actions[actionName] : null;
                if (!action)
                    return;
                
                if (actionToExecute && actionToExecute != (action.name || actionName))
                    return;

                $scope.$prepareAndExecute(scope, $event, elementName, action, (action.name || actionName));
            });
        }
    }

    /**
     * Do callbacks before 
     */
    $scope.$prepareAndExecute = function (scope, $event, elementName, action, actionName) {
        
        var options = angular.extend(angular.copy(action), {
            id: actionName,
            el: $event ? $event.target : elementName,
            eventType: action.isInit ? 'init' : 'fetch',
            action: (action.url || ("/api/" + (action.name || actionName))),
            data: action.data || (action.requestPath ? scope.model[action.requestPath] : scope.model),
            onComplete: action.onComplete || function (scope, data, ops, hasError) {
                if (scope.doParseResponse)
                    scope.doParseResponse(data, ops, hasError);
                else
                    console.log("ngViewLoader - onComplete: Not implemented");
                    
            },
            time: (new Date()).getTime()
        });

        if (options.params) {
            var params = {};
            angular.forEach(options.params, function (param, key) {
                switch (param.type) {
                    case 'static':
                        params[key] = param.value;
                        break;

                    case "scope":
                        params[key] = $parse(param.path)(scope);
                        if (params[key] && param.subpath)
                            params[key] = params[key][param.subpath];
                        break;

                    case "model":
                    default:
                        params[key] = $parse('model.' + param.path)(scope);
                        if (params[key] && param.subpath)
                            params[key] = params[key][param.subpath];
                        break;
                }
            });
            options.params = params;
        }

        var req = options.onBefore ? options.onBefore(scope, options) : scope.doPrepareRequest(options);
        if (req === false)
            return;

        console.log("Performing action - " + options.action);
        $scope.$doAction(options);
    }

    /************************************************************ Handle REST actions ****************************************************************/
    /**
     * Intercept all REST request 
     */
    $scope.$interceptRequest = function (options) {

        /*if (!options.headers) {
            options.headers = { 'Authorization': 'cd913947-477d-4a4f-bd17-fd5f062dbc24' };
        }
        else {
            options.headers.Authorization = 'cd913947-477d-4a4f-bd17-fd5f062dbc24';
        }*/
        return options.data;
    }

    /**
     * Raw REST action handler - Based on action configuration switches framework
     */
    $scope.$doAction = function (options) {
        options.data = $scope.$interceptRequest(options);

        switch (options.processingType) {
            case "nav":
                $location.path(options.path || options.url);
                break;
            case 'ajax':
                $scope.$doAjaxAction(options);
                break;

            case 'localstore':
                $scope.$doHttpAction(options);
                break;

            case '$http':
            case 'http':
            case 'angular':
            default:
                $scope.$doHttpAction(options);
        }
    }

    /**
     * Use local store for handling application data (Usefull for dev and debug versions)
     */
    $scope.$doLocalStore = function (options) {

        if (options.type === 'set')
            localStorage.setItem(options.action, JSON.stringify(options.data));
        
        return JSON.parse(localStorage.getItem(options.action));
    }

    /**
     * Use JQuery's ajax for executing REST actions
     */
    $scope.$doAjaxAction = function (options) {

        $.ajaxSetup({
            headers: options.headers,
            success: function (data) { $scope.$interceptResponse(data, options, false); },
            error: function (data) { $scope.$interceptResponse(data, options, true); },
            contentType: 'application/json; charset=utf-8'
        });
        
        if (!options.type || options.type.toLowerCase() == 'get')
            delete options.data;;

        $.ajax({
            url: options.action,
            data: options.data,
            type: options.type,
            params: options.params ? options.params : {}
        });
    }

    /**
     * Angular way of executing REST calls
     */
    $scope.$doHttpAction = function (options) {

        switch (options.type) {
            case "post":
                    $http.post(options.action,
                        options.data,
                        {
                            params: options.params ? options.params : {},
                            headers: options.headers
                        })
                        .success(function (data) { $scope.$interceptResponse(data, options, false); })
                        .error(function (data) { $scope.$interceptResponse(data, options, true); });
                break;
            
            default:
                $http({
                    url: options.action,
                    method: (options.type || "GET"),
                    params: options.params ? options.params : {},
                    headers: options.headers
                })
                .success(function (data) { $scope.$interceptResponse(data, options, false); })
                .error(function (data) { $scope.$interceptResponse(data, options, true); });
            break;
        }
    }

    /**
     * Intercept all REST calls response 
     */
    $scope.$interceptResponse = function (data, options, hasError) {
    
        if (options.el) {
            var scope = angular.element(typeof options.el == 'string' ?  '#' + options.el  : options.el).scope();
            
        }

        if (scope) {
            var result = data;
            if (options.resultPath)
                data = eval("result" + options.resultPath);

            if (options.resultModelPath)
                scope.model[options.resultModelPath] = data;
        }

        if (options['onComplete'])
            options['onComplete'](scope, data, options, hasError);

        if (ngGridLayoutPlugin && scope && scope.$schema && scope.$schema.config) {
            angular.forEach(scope.$schema.config, function (conf, gridName) {
                if (conf.plugins && conf.plugins.ngGridLayoutPlugin)
                    conf.plugins.ngGridLayoutPlugin.updateGridLayout();
            });
        }

        if (!hasError && options.postAction)
            $scope.$doPefromAction(options.eventType, options.el, scope, options.postAction);

        console.log("Time take to execute action '" + options.action + "' is " + ((new Date().getTime()) - options.time) + " ms")
    }
    /**
    * Destroy scope and leaky objects
    */
    $scope.$on('$destroy', function () {
        console.log('Destroy - $viewBuilderController' );
    });
}]);