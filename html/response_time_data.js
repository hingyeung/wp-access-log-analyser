getResponseTimeData = function () {
    return [
        ['Type', 'Resp. time'],
        [
        		"AutoSuggests",
        		32
        	],
        	[
        		"Home Page",
        		26
        	],
        	[
        		"Image (tomcat)",
        		15
        	],
        	[
        		"Other Java actions",
        		157
        	],
        	[
        		"Others",
        		5
        	],
        	[
        		"Search Results",
        		157
        	],
        	[
        		"Searches",
        		198
        	]
    ];
};

function drawResponseTimeChart() {
            var data = google.visualization.arrayToDataTable(
                    getResponseTimeData()
            );

            var options = {
                title:'WPM Avg Response Time Breakdown',
                hAxis: {title: 'Time (ms)'},
                legend: 'none'
            };

            var chart = new google.visualization.BarChart(document.getElementById('response_time_breakdown'));
            chart.draw(data, options);
        }
