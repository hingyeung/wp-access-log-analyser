function ChartCtrl($scope, $http) {
//    google.load("visualization", "1", {packages:["corechart"]});
//    google.setOnLoadCallback(function() {alert('asfd');});

    $http.get('http://localhost:3000/wp_access_log/chartData').success(function (data) {
        $scope.charts = data;
    });

    $scope.drawChart = function (chartName, domElementId) {
        var chart;
        for (var i = 0; i < $scope.charts.length; i++) {
            if ($scope.charts[i].chartName == chartName) {
                chart = $scope.charts[i];
            }
        }
        google.load("visualization", "1", {packages:["corechart"]});

        google.setOnLoadCallback(
            function() {
            var data = google.visualization.arrayToDataTable(
                chart.data
            );

            var options = {
                title:'WPM Request Type Breakdown',
                sliceVisibilityThreshold:1 / 10000000
            };

            var chart = new google.visualization.PieChart(document.getElementById(domElementId));
            chart.draw(data, options);
            }
        )
    };
};