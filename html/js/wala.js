// initialise angular after gapi is loaded
google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['wala']);
});
google.load('visualization', '1', {packages:['corechart']});

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
    // see http://goo.gl/l83A4 for more info on this directive
    // it has some useful tips on directive scope.
    // http://plnkr.co/edit/PYC6m4?p=preview
    directive('pieChart', function ($timeout) {
      return {
        restrict: 'EA',
        scope: {
          title:    '@title',
          width:    '@width',
          height:   '@height',
          data:     '=data',
          selectFn: '&select'
        },
        link: function($scope, $elm, $attr) {

          // Create the data table and instantiate the chart
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Label');
          data.addColumn('number', 'Value');
          var chart = new google.visualization.PieChart($elm[0]);

          draw();

          // Watches, to refresh the chart when its data, title or dimensions change
          $scope.$watch('data', function() {
            draw();
          }, true); // true is for deep object equality checking
          $scope.$watch('title', function() {
            draw();
          });
          $scope.$watch('width', function() {
            draw();
          });
          $scope.$watch('height', function() {
            draw();
          });

          // Chart selection handler (handles event when user select a section of the pie chart)
          google.visualization.events.addListener(chart, 'select', function () {
            var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
              $scope.$apply(function () {
                $scope.selectFn({selectedRowIndex: selectedItem.row});
              });
            }
          });

          function draw() {
            if (!draw.triggered) {
              draw.triggered = true;
              $timeout(function () {
                draw.triggered = false;
                var label, value;
                data.removeRows(0, data.getNumberOfRows());
                angular.forEach($scope.data, function(row) {
                  label = row[0];
                  value = parseFloat(row[1], 10);
                  if (!isNaN(value)) {
                    data.addRow([row[0], value]);
                  }
                });
                var options = {'title': $scope.title,
                               'width': $scope.width,
                               'height': $scope.height};
                chart.draw(data, options);
                // No raw selected
                $scope.selectFn({selectedRowIndex: undefined});
              }, 0, true);
            }
          }
        }
      };
    }).
    // this controller depends on ChartService, which is defined in wala.services module
    // the dependencies are then passed to the controller function
    controller('PieChartCtrl', ['$scope', 'ChartService', function ($scope, chartService) {
        var serviceUrl = 'http://localhost:4567';
        $scope.chartData = [];

        $scope.getRequestTypeData = function (db, coll) {
            console.log('calling getRequestTypeData()');
            var requestTypes = ['search', 'result', 'autoSuggest', 'homepage'];
            for (var i = 0; i < requestTypes.length; i++) {
                var promise = chartService.getCount(db, coll, '{"wpol_tags": "' + requestTypes[i] + '"}');
                // handling closure
                promise.then(function (requestType) {
                    return function (resp) {
                        $scope.chartData.push([requestType, resp.data]);
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
