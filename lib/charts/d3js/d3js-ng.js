angular.module('d3js-ng',[])
    .directive('d3jsbar', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            chartData: '=config'
        },
        link: function (scope, element, attrs) {
            var chart = d3.select(element[0]);
            chart.append("div").attr("class", "d3jschart").selectAll('div').data(scope.chartData.data).enter().append("div").transition().ease("elastic")
                .style("width", function (d) {return d + "%";})
                .text(function (d) {return d + "%";});

            scope.$watch('chartData.data',function (newValue,oldValue)
            {
                chart.html('');
                chart.append("div").attr("class", "d3jschart").selectAll('div').data(newValue).enter().append("div").transition().ease("elastic")
                    .style("width", function (d) {return d + "%";})
                    .text(function (d) {return d + "%";});
            }, true);
        }
    }
});