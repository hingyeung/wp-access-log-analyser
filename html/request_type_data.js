getRequestTypeData = function () {
    return [
        [
            "Type", "no. of requests"
        ],
        [
            "AutoSuggests",
            64404
        ],
        [
            "CSS",
            19787
        ],
        [
            "Home Page",
            48475
        ],
        [
            "Image (ICS)",
            67
        ],
        [
            "Image (apache)",
            55532
        ],
        [
            "Image (tomcat)",
            37351
        ],
        [
            "Javascripts",
            53665
        ],
        [
            "Others",
            5270
        ],
        [
            "Other Java actions",
            9272
        ],
        [
            "Search Results",
            9920
        ],
        [
            "Searches",
            11531
        ],
        [
            "Shares",
            16
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
        sliceVisibilityThreshold:1 / 100000
    };

    var chart = new google.visualization.PieChart(document.getElementById('request_type_breakdown'));
    chart.draw(data, options);
}