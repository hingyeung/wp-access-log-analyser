db.system.js.save({_id:'getRequestType', value:function (request_uri_path) {
    var uri_path = request_uri_path;
    if (request_uri_path.indexOf(';') != -1) {
        uri_path = request_uri_path.substring(0, request_uri_path.indexOf(';'));
    }

    var type;
    if (uri_path.match(/\.css$/)) {
        type = 'CSS';
    } else if (uri_path.match(/^\/v2\/web/)) {
        type = 'EMS';
    } else if (uri_path.match(/\.js$/)) {
        type = 'Javascripts';
    } else if (uri_path.match(/^\/ics\//)) {
        type = 'Image (ICS)';
    } else if (uri_path.match(/^\/feed\//)) {
        type = 'Feeds';
    } else if (uri_path.match(/\.png$|\.gif$|\.jpg$/)) {
        type = 'Image (apache)';
    } else if (uri_path.match(/\.image$/)) {
        type = 'Image (tomcat)';
    } else if (uri_path.match(/doSearch.action$/)) {
        type = 'Searches';
    } else if (uri_path.match(/^\/listing\//)) {
        type = 'Shares';
    } else if (uri_path.match(/^\/(business|government|residential)-listing|showCaption.action$|captionLineListingDetails.action$/)) {
        type = 'Search Results';
    } else if (uri_path.match(/urlProxy.action$/)) {
        type = 'AutoSuggests';
    } else if (uri_path.match(/\.action$/)) {
        type = 'Other Java actions';
    } else if (uri_path.match(/^\/+$/)) {
        type = 'Home Page';
    } else {
        // uncomment the following line if you want to know what are in the "others" category
//            type = uri_path;
        type = 'Others';
    }

    return type;
}});

