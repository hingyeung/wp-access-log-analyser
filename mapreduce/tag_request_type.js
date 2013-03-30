
var getRequestTypeTag = function (request_uri_path) {
    var uri_path = request_uri_path;
    if (request_uri_path.indexOf(';') != -1) {
        uri_path = request_uri_path.substring(0, request_uri_path.indexOf(';'));
    }

    var type;
    if (uri_path.match(/\.css$/)) {
        type = ['css','apache'];
    } else if (uri_path.match(/^\/v2\/web/)) {
        type = ['ems', 'external'];
    } else if (uri_path.match(/\.js$/)) {
//        type = 'Javascripts';
        type = ['apache', 'javascript'];
    } else if (uri_path.match(/^\/ics\//)) {
        type = ['image', 'ics'];
    } else if (uri_path.match(/^\/feed\//)) {
        type = ['feeds'];
    } else if (uri_path.match(/\.png$|\.gif$|\.jpg$/)) {
//        type = 'Image (apache)';
        type = ['apache', 'image'];
    } else if (uri_path.match(/\.image$/)) {
        type = ['image', 'tomcat'];
    } else if (uri_path.match(/doSearch.action$/)) {
        type = ['search', 'tomcat'];
    } else if (uri_path.match(/^\/listing\//)) {
        type = ['share', 'tomcat'];
    } else if (uri_path.match(/^\/(business|government|residential)-listing|showCaption.action$|captionLineListingDetails.action$/)) {
        type = ['result', 'tomcat'];
    } else if (uri_path.match(/urlProxy.action$/)) {
        type = ['autoSuggest', 'tomcat'];
    } else if (uri_path.match(/\.action$/)) {
        type = ['otherbackend', 'tomcat'];
    } else if (uri_path.match(/^\/+$/)) {
        type = ['homepage', 'tomcat'];
    } else {
        // uncomment the following line if you want to know what are in the "others" category
//            type = uri_path;
        type = ['others'];
    }

    return type;
};

db.stageb.find().forEach(function(doc) {
    var tags = getRequestTypeTag(doc.uri_path);
//    print(doc.uri_path);
//    print(tags);
    db.stageb.update({_id: doc._id, wpol_tags:{$exists: false}}, {$pushAll: {"wpol_tags": tags}});
});

// remove wp_tags from all docs
db.prod.update({wpol_tags:{$exists:true}}, {$unset: {wpol_tags:1}}, false, true)

// count docs with wp_tags
db.prod.find({wpol_tags:{$exists:true}}).count()