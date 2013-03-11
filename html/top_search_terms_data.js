getTopSearchTermsData = function () {
    return [
        [
            "Search Term", "no. of requests"
        ],
        [
            "ato, nsw",
            48
        ],
        [
            "telstra corporation limited, vic",
            48
        ],
        [
            "telstra business, Port Macquarie, NSW",
            33
        ],
        [
            "Goulburn Valley Grammar School, Shepparton Region, VIC",
            12
        ],
        [
            "Bigriver Supermarket, Waikerie SA",
            10
        ],
        [
            "Independent Locksmiths & Security, Granville NSW",
            9
        ],
        [
            "Ausfuel, gladstone",
            7
        ],
        [
            "Brisbane Airport Parking, Brisbane QLD",
            7
        ],
        [
            "Independent Locksmiths & Security, Parramatta NSW",
            7
        ],
        [
            "walkers arms hotel, Adelaide",
            7
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