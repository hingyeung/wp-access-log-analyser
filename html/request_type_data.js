getRequestTypeData = function () {
    return [
        [
            "Type", "no. of requests"
        ],

        [
        		"AutoSuggests",
        		53613
        	],
        	[
        		"Home Page",
        		54978
        	],
        	[
        		"Image (tomcat)",
        		465
        	],
        	[
        		"Other Java actions",
        		36834
        	],
        	[
        		"Others",
        		14752
        	],
        	[
        		"Search Results",
        		7428
        	],
        	[
        		"Searches",
        		55851
        	]
    ];
};
// TODO change this to read from db using mongodb-rest
// curl -H "Content-Type: application/json" 'http://localhost:3000/wp_access_log/chartData?qury=%7B%22chartName%22%3A%22requestTypeBreakdown%22%7D'
function drawRequestTypeChart() {
    var data = google.visualization.arrayToDataTable(
        getRequestTypeData()
    );

    var options = {
        title:'WPM Request Type Breakdown',
        sliceVisibilityThreshold:1 / 10000000
    };

    var chart = new google.visualization.PieChart(document.getElementById('request_type_breakdown'));
    chart.draw(data, options);
}