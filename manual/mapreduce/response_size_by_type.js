var map = function () {
//    var uri_path = this.uri_path;
//    if (uri_path.indexOf(';') != -1) {
//        uri_path = uri_path.substring(0, uri_path.indexOf(';'));
//    }

    var type = getRequestType(this.uri_path);
    countByteObj = {count: 1, cs_bytes: parseInt(this.cs_bytes)};

    emit(type, countByteObj);
};

var reduce = function(key, countByteObjs) {
    // the output of the reduce() function must have the same type emitted by map() function
    var reducedValue = {count:0, cs_bytes: 0};
    for (var idx = 0; idx < countByteObjs.length; idx++) {
        reducedValue.count += countByteObjs[idx].count;
        reducedValue.cs_bytes += countByteObjs[idx].cs_bytes;
    }
    return reducedValue;
}

var finalize = function(key, reducedValue) {
    reducedValue.average = Math.round(reducedValue.cs_bytes / reducedValue.count);
    return reducedValue;
}

var mapReduceToNestArray = function(mapReduceResult) {
    var nestedArray = [], results = mapReduceResult.results;
    for (var idx = 0; idx < results.length; idx++) {
        nestedArray.push([results[idx]._id, results[idx].value.average]);
    }
    return nestedArray;
}

mapReduceToNestArray(
    db.prod.mapReduce(map, reduce, {finalize: finalize,  out:{inline:1}, query: {cs_bytes: {$exists:1}, dest_host:'stageb-mobile.whitepages.com.au'}})
);


var emit = function(key, value) {
        print("emit");
        print("key: " + key + "  value: " + tojson(value));
}

var myCursor = db.prod.find({$exists: {cs_bytes:1} })

while (myCursor.hasNext()) {
    var doc = myCursor.next();
    map.apply(doc);
}