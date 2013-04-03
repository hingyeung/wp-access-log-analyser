var cleanupUriPath = function(request_uri_path) {
    var uri_path = request_uri_path;
    if (request_uri_path.indexOf(';') != -1) {
            uri_path = request_uri_path.substring(0, request_uri_path.indexOf(';'));
        }
    return uri_path;
}

var getRequestDestination = function (request_uri_path) {
    var dest = 'tomcat', uri_path = cleanupUriPath(request_uri_path);

    var apachePatterns = [
        /\.css$/, /\.js$/, /\.png$|\.gif$|\.jpg$/
    ];

    for (var i = 0; i < apachePatterns.length; i++) {
        if (uri_path.match(apachePatterns[i])) {
            dest = 'apache';
            break;
        }
    }

    return dest;
}

var getRequestTypeTag = function (request_uri_path) {
    var type = null, uri_path = cleanupUriPath(request_uri_path);

    var patternMap = [
        [/\.css$/, 'css'],
        [/\.js$/, 'javascript'],
        [/^\/ics\//, 'image'],
        [/^\/feed\//, 'feed'],
        [/\.png$|\.gif$|\.jpg$/, 'image'],
        [/\.image$/, 'image'],
        [/doSearch.action$/, 'search'],
        [/^\/listing\//, 'share'],
        [/^\/(business|government|residential)-listing|showCaption.action$|captionLineListingDetails.action$/, 'result'],
        [/urlProxy.action$/, 'autoSuggest'],
        [/\.action$/, 'otherbackend'],
        [/^\/+$/, 'homepage'],
        [/\/home.action$/, 'homepage'],
        [/^\/ics\//, 'ics']
    ];

    for (var i = 0; i < patternMap.length; i++) {
        if (uri_path.match(patternMap[i][0])) {
            type = patternMap[i][1];
            break;
        }
    }

    if (!type) {
        type = 'others';
    }

    return type;
};

var getDeviceType = function(user_agent) {
    var type = [],
        deviceMap = [
            [/iPhone;.+OS (\d+_\d+_\d+)/, ['iphone','ios']],
            [/iPad;.+OS (\d+_\d+_\d+)/, ['ipad', 'ios']],
            [/iPod;.+OS (\d+_\d+_\d+)/, ['ipod', 'ios']],
            [/Android;/, ['android']],
            [/.+Firefox\/(\d+\.\d+)/, ['firefox']],
            [/Android (\d+\.\d+\.\d+)/, ['android']],
            [/Windows Phone (\d+\.\d+);/, ['windowsphone']],
            [/MSIE (\d+\.\d+);/, ['msie']]
        ];

    for (var i = 0; i < deviceMap.length; i++) {
        var matches = user_agent.match(deviceMap[i][0]);
        if (matches) {
            type = type.concat(deviceMap[i][1]);
            for (var j = 1; j < matches.length; j++) {
                type.push(matches[j]);
            }
        }
    }

    return type;
};

var environment = 'prod';
var coll = db.getCollection(environment);

coll.find().forEach(function(doc) {
    var requestType = getRequestTypeTag(doc.uri_path);
    coll.update({_id: doc._id, wp_request_type:{$exists: false}}, {$push: {"wp_request_type": requestType}});

    var dest = getRequestDestination(doc.uri_path);
    coll.update({_id: doc._id, wp_request_dest:{$exists: false}}, {$push: {"wp_request_dest": dest}});

    var deviceType = getDeviceType(doc.http_user_agent);
    coll.update({_id: doc._id, wp_device_type:{$exists: false}}, {$push: {"wp_device_type": deviceType}});
});

// create index to speed up pie chart data search
coll.ensureIndex({timestamp:1,wp_request_type:1});
coll.ensureIndex({timestamp:1,wp_request_dest:1});
coll.ensureIndex({timestamp:1,wp_device_type:1});

// remove wp tags from all docs
coll.update({wp_request_type:{$exists:true}}, {$unset: {wp_request_type:1}}, false, true);
coll.update({wp_request_dest:{$exists:true}}, {$unset: {wp_request_dest:1}}, false, true);
coll.update({wp_device_type:{$exists:true}}, {$unset: {wp_device_type:1}}, false, true);

// count docs with wp_tags
coll.find({wp_request_type:{$exists:true}}).count();