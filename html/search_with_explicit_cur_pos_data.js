getSearchWithExplicitCurPosData = function () {
    return [
        [
            "Type", "no. of requests"
        ],
        [ "Current location", 0 ], [ "Other locations", 55851 ]
    ];
};

function drawSearchWithExplicitCurLoc() {
    var data = google.visualization.arrayToDataTable(
        getSearchWithExplicitCurPosData()
    );

    var options = {
        title:'Percentage of WPM searches made with explicit "Current Location"'
    };

    var chart = new google.visualization.PieChart(document.getElementById('search_by_current_location'));
    chart.draw(data, options);
}