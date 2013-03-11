getRequestSizeData = function() {
    return [
                            [   "Type", "bytes" ],
                        	[
                        		"AutoSuggests",
                        		16971
                        	],

                        	[
                        		"Home Page",
                        		6842
                        	],
                        	[
                        		"Image (ICS)",
                        		11448
                        	],

                        	[
                        		"Image (tomcat)",
                        		30064
                        	],

                        	[
                        		"Others",
                        		20865
                        	],
                        	[
                        		"Other Java actions",
                        		9757
                        	],
                        	[
                        		"Search Results",
                        		6959
                        	],
                        	[
                        		"Searches",
                        		11212
                        	],
                        	[
                        		"Shares",
                        		1250
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