getSearchWithImplicitCurPosData = function () {
    return [
        [
            "Type", "no. of requests"
        ],
        [
            "With lat/lng",
            7759
        ],
        [
            "Without lat/lng",
            1930
        ]
    ];
};

function drawSearchWithImplicitCurLoc() {
    var data = google.visualization.arrayToDataTable(
        getSearchWithImplicitCurPosData()
    );

    var options = {
        title:'Percentage of WPM searches made with implicit current location'
    };

    var chart = new google.visualization.PieChart(document.getElementById('search_with_lat_lon'));
    chart.draw(data, options);
}