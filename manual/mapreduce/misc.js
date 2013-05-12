// search with gps
db.prod.count({$or: [{wp_request_params:'business'},{wp_request_params:'government'},{wp_request_params:'residential'}], geocode:{$exists: true}})


// total search
db.prod.count({$or: [{wp_request_params:'business'},{wp_request_params:'government'},{wp_request_params:'residential'}]})
