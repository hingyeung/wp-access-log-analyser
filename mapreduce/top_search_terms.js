var map = function () {
    var requestType = getRequestType(this.uri_path);
    if (requestType == 'Searches') {
        var name = getRequestParamValue(this.uri_query, 'nm');
        var searchType = getRequestParamValue(this.uri_query, 'sd');
        var location = getRequestParamValue(this.uri_query, 'location');

        if (searchType != '' && name != '') {
            emit({searchType: searchType, name: name, location: location}, 1);
        }
    }
}

var reduce = function (key, values) {
    return Array.sum(values);
}

var mapReduceToNestArray = function(cursor) {
    var nestedArray = [];
    while(cursor.hasNext()) {
        var res = cursor.next();
        var key = decodeURIComponent((res._id.name + ', ' + res._id.location + '').replace(/\+/g, '%20'));
        nestedArray.push([key, res.value]);
    }
    return nestedArray;
}

db.prod.mapReduce(map, reduce, {out:'tmp_mapreduce_out', query:{uri_path:{$exists:1}, uri_query:{$exists:1}}});
mapReduceToNestArray(db.tmp_mapreduce_out.find({'_id.searchType': 'b'}).sort({'value':-1}).limit(10));