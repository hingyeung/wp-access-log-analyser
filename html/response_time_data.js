getResponseTimeData = function () {
    return [
        ['Type', 'Resp. time'],
        [
            "AutoSuggests",
            26
        ],
        [
            "CSS",
            17
        ],
        [
            "Home Page",
            42
        ],
        [
            "Image (ICS)",
            210
        ],
        [
            "Image (apache)",
            8
        ],
        [
            "Image (tomcat)",
            11
        ],
        [
            "Javascripts",
            11
        ],
        [
            "Others",
            344
        ],
        [
            "Other Java actions",
            158
        ],
        [
            "Search Results",
            328
        ],
        [
            "Searches",
            260
        ],
        [
            "Shares",
            446
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
