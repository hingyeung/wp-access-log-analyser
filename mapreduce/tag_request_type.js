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
            [/MSIE (\d+\.\d+);/, ['msie']]
        ];

var categorise = function (categoryDef, input, defaultCategory) {
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

    if (type.length == 0) {
        return defaultCategory;
    }

    return type;
};

var environment = 'prod';
var coll = db.getCollection(environment);

coll.find().forEach(function(doc) {
    var uriPath = cleanupUriPath(doc.uri_path);

    var requestType = categorise(REQUEST_TYPE_MAP, uriPath, 'others');
    coll.update({_id: doc._id, wp_request_type:{$exists: false}}, {$pushAll: {"wp_request_type": requestType}});

    var dest = categorise(DESTINATION_MAP, uriPath, 'tomcat');
    coll.update({_id: doc._id, wp_request_dest:{$exists: false}}, {$pushAll: {"wp_request_dest": dest}});

    var deviceType = categorise(DEVICE_MAP, doc.http_user_agent, '');
    coll.update({_id: doc._id, wp_device_type:{$exists: false}}, {$pushAll: {"wp_device_type": deviceType}});
});

// create index to speed up pie chart data search
coll.ensureIndex({timestamp:1,wp_request_type:1});
coll.ensureIndex({timestamp:1,wp_request_dest:1});
coll.ensureIndex({timestamp:1,wp_device_type:1});

// drop indexes
coll.dropIndex({timestamp:1,wp_request_type:1});
coll.dropIndex({timestamp:1,wp_request_dest:1});
coll.dropIndex({timestamp:1,wp_device_type:1});

// remove wp tags from all docs
coll.update({wp_request_type:{$exists:true}}, {$unset: {wp_request_type:1}}, false, true);
coll.update({wp_request_dest:{$exists:true}}, {$unset: {wp_request_dest:1}}, false, true);
coll.update({wp_device_type:{$exists:true}}, {$unset: {wp_device_type:1}}, false, true);

// count docs with wp_tags
coll.find({wp_request_type:{$exists:true}}).count();