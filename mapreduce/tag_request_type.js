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
        [/\.css$/, ['css']],
        [/\.js$/, ['javascript']],
        [/^\/ics\//, ['image']],
        [/^\/feed\//, ['feed']],
        [/\.png$|\.gif$|\.jpg$/, ['image']],
        [/\.image$/, ['image']],
        [/doSearch.action$/, ['search']],
        [/^\/listing\//, ['share']],
        [/^\/(business|government|residential)-listing|showCaption.action$|captionLineListingDetails.action$/, ['result']],
        [/urlProxy.action$/, ['autoSuggest']],
        [/\.action$/, ['backend']],
        [/^\/+$/, ['homepage']],
        [/\/home.action$/, ['homepage']],
        [/^\/ics\//, ['ics']],
        [/^\/cp\//, ['cp']]
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
    [/sb=b&*/, ['business']],
    [/sb=g&*/, ['government']],
    [/sb=r&*/, ['residential']]
];

const SEARCH_TERM_MAP = [
    [/nm=([^&]+)/, []],
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
                type.push(matches[j]);
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

coll.find().forEach(function(doc) {
    var uriPath = cleanupUriPath(doc.uri_path);

    var requestType = categorise(REQUEST_TYPE_MAP, uriPath, 'others');
    coll.update({_id: doc._id, wp_request_types:{$exists: false}}, {$pushAll: {"wp_request_types": requestType}});

    var dest = categorise(DESTINATION_MAP, uriPath, 'tomcat');
    coll.update({_id: doc._id, wp_request_dests:{$exists: false}}, {$pushAll: {"wp_request_dests": dest}});

    var deviceType = categorise(DEVICE_MAP, doc.http_user_agent, null);
    coll.update({_id: doc._id, wp_device_types:{$exists: false}}, {$pushAll: {"wp_device_types": deviceType}});

    var params = categorise(REQUEST_PARAM_MAP, doc.uri_query, null);
    coll.update({_id: doc._id, wp_request_params:{$exists: false}}, {$pushAll: {"wp_request_params": params}});

    var geocode = categorise(GEOCODE, doc.uri_query, null);
    coll.update({_id: doc._id, wp_geocode:{$exists: false}}, {$pushAll: {"wp_geocode": geocode}});

    if (uriPath.match(/doSearch.action$/)) {
        var searchTerms = categorise(SEARCH_TERM_MAP, doc.uri_query, null);
        coll.update({_id: doc._id, wp_search_terms:{$exists: false}}, {$pushAll: {"wp_search_terms": searchTerms}});
    }
});

var tagTypes = ["wp_request_types", "wp_request_dests", "wp_device_types", "wp_request_params", "geocode", "wp_search_terms"];

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