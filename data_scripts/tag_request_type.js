var cleanupUriPath = function(request_uri_path) {
    var uri_path = request_uri_path;
    if (request_uri_path.indexOf(';') != -1) {
            uri_path = request_uri_path.substring(0, request_uri_path.indexOf(';'));
        }
    return uri_path;
}

const DESTINATION_MAP = [
    [/\.css$/, ['apache']],
    [/\.js$/, ['apache']],
    [/\.png$|\.gif$|\.jpg$/, ['apache']]
];

const REQUEST_TYPE_MAP = [
        [/\/quickFinderDetail\.action$/, ['qf']],
        [/\.css$/, ['css']],
        [/\.js$/, ['javascript']],
        [/^\/ics\//, ['image']],
        [/^\/feed\//, ['feed']],
        [/\.png$|\.gif$|\.jpg$/, ['image']],
        [/\.image$/, ['image']],
        [/doSearch.action$/, ['search']],
        [/^\/listing\//, ['share']],
        [/^\/(business|government|residential)-listing\/(.+)|showCaption.action$|captionLineListingDetails.action$/, ['contact']],
        [/^\/(business|government|residential)-listing\/(.+)\?.*contactPoint=/, ['share']],
        [/urlProxy.action$/, ['autoSuggest']],
        [/\.action$/, ['backend']],
        [/^\/+$/, ['homepage']],
        [/\/home.action$/, ['homepage']],
        [/^\/ics\//, ['ics']],
        [/^\/cp\//, ['cp']],
		[/^\/mylist\/createList.action/, ['createlist']],
		[/^\/mylist\/displayListDetails.action/, ['displaylist']],
		[/^\/mylist\/addToNewList.action/, ['addtonewlist']],
		[/^\/mylist\/renameList.action/, ['renamelist']],
		[/^\/mylist\/displayListDetails.action/, ['displaylistdetails']],
		[/^\/mylist\/ajaxAddToList.action/, ['addtolist']]
    ];

const DEVICE_MAP = [
            [/iPhone;.+OS (\d+_\d+_\d+)/, ['iphone','ios']],
            [/iPad;.+OS (\d+_\d+_\d+)/, ['ipad', 'ios']],
            [/iPod;.+OS (\d+_\d+_\d+)/, ['ipod', 'ios']],
            [/Android;/, ['android']],
            [/.+Firefox\/(\d+\.\d+)/, ['firefox']],
            [/Android (\d+\.\d+\.\d+)/, ['android']],
            [/Windows Phone (\d+\.\d+);/, ['windowsphone']],
            [/MSIE (\d+\.\d+);/, ['msie']],
            [/iphoneclient|androidclient/, ['client']]
        ];

const REQUEST_PARAM_MAP = [
    [/sd=b&*/, ['business']],
    [/sd=g&*/, ['government']],
    [/sd=r&*/, ['residential']]
];

const SEARCH_TERM_MAP = [
    [/nm=([^&]+)/, []]
];

const SEARCH_LOCATION_MAP = [
    [/location=([^&]+)/, []]
];

const GEOCODE = [
    [/lat=(-*\d+\.\d+)&lon=(-*\d+\.\d+)/, []]
];

var categorise = function (categoryDef, input, defaultCategory) {
    if (typeof(input) != 'string') {
        return [];
    }

    var type = [];

    for (var i = 0; i < categoryDef.length; i++) {
        var matches = input.match(categoryDef[i][0]);
        if (matches) {
            type = type.concat(categoryDef[i][1]);
            for (var j = 1; j < matches.length; j++) {
                if (matches[j]) {
                    type.push(matches[j]);
                }
            }
        }
    }
    if (type.length == 0 && defaultCategory) {
        return [defaultCategory];
    }

    return type;
};


var environment = 'prod';
var coll = db.getCollection(environment);

var addTagsToDoc = function(doc, tagDefMap, input, defaultTag, tagField) {
    var tags = categorise(tagDefMap, input, defaultTag);
    if (tags.length == 0) {
        return;
    }
    var updateQuery = {};
    updateQuery["_id"] = doc._id;
    updateQuery[tagField] = {$exists: false};
    var tagValueObj = {};
    tagValueObj[tagField] = tags;
    coll.update(updateQuery, {$pushAll: tagValueObj});
}

coll.find().forEach(function(doc) {
    var uriPath = cleanupUriPath(doc.uri_path);

    addTagsToDoc(doc, REQUEST_TYPE_MAP, uriPath, 'others', 'wp_request_types');
    addTagsToDoc(doc, DESTINATION_MAP, uriPath, 'tomcat', 'wp_request_dests');
    addTagsToDoc(doc, DEVICE_MAP, doc.http_user_agent, null, 'wp_device_types');
    addTagsToDoc(doc, REQUEST_PARAM_MAP, doc.uri_query, null, 'wp_request_params');
    addTagsToDoc(doc, GEOCODE, doc.uri_query, null, 'geocode');
    if (uriPath.match(/doSearch.action$/)) {
        addTagsToDoc(doc, SEARCH_TERM_MAP, doc.uri_query, null, 'wp_search_terms');
        addTagsToDoc(doc, SEARCH_LOCATION_MAP, doc.uri_query, null, 'wp_search_locations');
    }
});

var tagTypes = ["wp_request_types", "wp_request_dests", "wp_device_types", "wp_request_params", "geocode", "wp_search_terms", "wp_search_locations"];

// create index to speed up pie chart data search
for (var i = 0; i < tagTypes.length; i++) {
    var index = {};
    index["timestamp"] = 1;
    index[tagTypes[i]] = 1;
    coll.ensureIndex(index);
}

// drop indexes
for (var i = 0; i < tagTypes.length; i++) {
    var index = {};
    index["timestamp"] = 1;
    index[tagTypes[i]] = 1;
    coll.dropIndex(index);
}

// remove wp tags from all docs
for (var i = 0; i < tagTypes.length; i++) {
    var unsetValue = {}, query = {};
    query[tagTypes[i]] = {$exists: true};
    unsetValue[tagTypes[i]] = 1;
    coll.update(query, {$unset: unsetValue}, false, true);
}

// count docs with wp_tags
coll.find({wp_request_types:{$exists:true}}).count();


// top 10 business search term / location
db.prod.aggregate(
    [
        { $match : { uri_path:/doSearch.action/, wp_search_terms:{ $ne: [] }, wp_request_params: 'business' }},
        {
            $group:{
                _id:"$wp_search_terms",
                counts:{ $sum:1 }
            }
        },
        {$sort:{counts:-1}},
        {$limit:10}
    ]
);

// top 10 business captions
db.prod.aggregate(
    [
        { $match : { wp_request_types:'contact', wp_request_types:'business' }},
        {
            $group:{
                _id:"$wp_request_types",
                counts:{ $sum:1 }
            }
        },
        {$sort:{counts:-1}},
        {$limit:10}
    ]
);
