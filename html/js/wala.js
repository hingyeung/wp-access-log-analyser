angular.module('wala.services', []). // module name
    factory(
        'ChartService',             // name of this service
        [
            '$http',                // dependencies for this service
            function($http) {
                var chartService = {
                    serviceUrl: 'http://localhost:4567',

                    getCount: function(db, coll, query) {   // function in this service
                        return $http.get(this.serviceUrl + '/count/' + db + '/' + coll + '?query=' + encodeURI(query));
                    }
                };

                return chartService;
            }
        ]
);

angular.module('wala', ['wala.services']).
    directive('chart',function () {
        return {
            scope: {
                // getting read-only value of attribute "chart-data" on the DOM
                // Confusing! see http://goo.gl/HPBln
                chartData: "&chartData"
            },
            restrict:'A',
            link:function ($scope, $elm, $attr) {
                console.log($scope.chartData());
                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Topping');
                data.addColumn('number', 'Slices');
                data.addRows(
//                    [
//                        ['Mushrooms', 3],
//                        ['Onions', 1],
//                        ['Olives', 1],
//                        ['Zucchini', 1],
//                        ['Pepperoni', 2]
//                    ]
                    $scope.chartData()
                );

                // Set chart options
                var options = {'title':'How Much Pizza I Ate Last Night',
                    'width':400,
                    'height':300};

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart($elm[0]);
                chart.draw(data, options);
            }
        }
    }).
    // this controller depends on ChartService, which is defined in wala.services module
    // the dependencies are then passed to the controller function
    controller('PieChartCtrl', ['$scope', 'ChartService', function ($scope, chartService) {
        var serviceUrl = 'http://localhost:4567';
        $scope.counts = [];

        $scope.getRequestTypeData = function (db, coll) {
            console.log('calling getRequestTypeData()');
            var requestTypes = ['search', 'result', 'autoSuggest', 'homepage'];
            for (var i = 0; i < requestTypes.length; i++) {
                var promise = chartService.getCount(db, coll, '{"wpol_tags": "' + requestTypes[i] + '"}');
                // handling closure
                promise.then(function (requestType) {
                    return function (resp) {
                        $scope.counts.push([requestType, resp.data]);
                    }
                }(requestTypes[i]));
            }
        };

        $scope.dummyCallToController = function() {
            console.log('HELLO dummy');
            return 'HELLO dummy';
        }
    }]);

//var PieChartCtrl = ['$scope', 'ChartService', function($scope, ChartService) {
//    var serviceUrl = 'http://localhost:4567';
//    $scope.counts = {};
//
//    $scope.getRequestTypeData = function(db, coll) {
//        var requestTypes = ['search', 'result', 'autoSuggest', 'homepage'];
//        for (var i = 0; i < requestTypes.length; i++) {
//            var promise = ChartService.getCount(db, coll, '{"wpol_tags": "' + requestTypes[i] + '"}');
//            // handling closure
//            promise.then(function(requestType) {
//                return function(resp) { $scope.counts[requestType] = resp.data; }
//            }(requestTypes[i]));
//        }
//    }
//}];

//google.setOnLoadCallback(function() {
//        angular.bootstrap(document.body, ['wala']);
//    });
google.load('visualization', '1', {packages: ['corechart']});