getRequestSizeData = function() {
    return [
                            [   "Type", "bytes" ],
        [
        		"AutoSuggests",
        		1283635
        	],
        	[
        		"Home Page",
        		1286521
        	],
        	[
        		"Image (tomcat)",
        		1211568
        	],
        	[
        		"Other Java actions",
        		1270092
        	],
        	[
        		"Search Results",
        		1251295
        	],
        	[
        		"Searches",
        		1283677
        	]
                        ];
};

function drawRequestSizeChart() {
            var data = google.visualization.arrayToDataTable(
                    getRequestSizeData()
            );

            var options = {
                title:'WPM Avg Response Size Breakdown',
                legend: 'none'
            };

            var chart = new google.visualization.BarChart(document.getElementById('response_size_breakdown'));
            chart.draw(data, options);
        }