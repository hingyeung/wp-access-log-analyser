// combined
db.prod.aggregate(
    [
        { $match: { wp_request_types: 'search'}},
        { $project: { wp_request_params: 1, wp_search_terms: 1 } },
        { $group: {
            _id : {search_term: "$wp_search_terms", type: "$wp_search_params"},
            counts : { $sum : 1 }
        } },
        { $sort: {counts: -1 }},
        { $limit: 20 }
    ]
)

// business only
db.prod.aggregate(
    [
        { $match: { wp_request_types: 'search', wp_search_terms: {$exists: true}, wp_request_params: 'business'}},
        { $project: { wp_request_params: 1, wp_search_terms: 1 } },
        { $unwind : "$wp_search_terms" },
        { $group: {
            _id : {$toLower: "$wp_search_terms"},
            counts : { $sum : 1 }
        } },
        { $sort: {counts: -1 }},
        { $limit: 20 }
    ]
)