getTopSearchTermsData = function () {
    return [
        [
            "Search Term", "no. of requests"
        ],
        [
        		"botanical gardens, NSW",
        		1206
        	],
        	[
        		"botanical gardens, VIC",
        		794
        	],
        	[
        		"botanical gardens, QLD",
        		538
        	],
        	[
        		"zielke desgin drafting pty ltd, ",
        		336
        	],
        	[
        		"chemist, NSW",
        		326
        	],
        	[
        		"botanical gardens, WA",
        		314
        	],
        	[
        		"N.Hemelaar, WA",
        		300
        	],
        	[
        		"Chan, NSW",
        		274
        	],
        	[
        		"pharmacy, NSW",
        		272
        	],
        	[
        		"house rental agents, NSW",
        		264
        	]
    ];
};

function drawTopSearchTerms() {
    var data = google.visualization.arrayToDataTable(
        getTopSearchTermsData()
    );

    var options = {
        title:'Top 10 Business Search Terms'
    };

    var chart = new google.visualization.PieChart(document.getElementById('top_bus_search_terms'));
    chart.draw(data, options);
}