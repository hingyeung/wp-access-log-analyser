getRequestSizeData = function() {
    return [
                            [   "Type", "bytes" ],
        [
        		"AutoSuggests",
        		1261197
        	],
        	[
        		"Home Page",
        		1253804
        	],
        	[
        		"Image (tomcat)",
        		1206957
        	],
        	[
        		"Other Java actions",
        		1242148
        	],
        	[
        		"Others",
        		1191571
        	],
        	[
        		"Search Results",
        		1199174
        	],
        	[
        		"Searches",
        		1248915
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