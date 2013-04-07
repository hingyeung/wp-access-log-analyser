var map = function () {
//    var uri_path = this.uri_path;
//    if (uri_path.indexOf(';') != -1) {
//        uri_path = uri_path.substring(0, uri_path.indexOf(';'));
//    }

    var type = getRequestType(this.uri_path);
    countByteObj = {count: 1, duration: Math.round(parseFloat(this.duration * 1000))};

    emit(type, countByteObj);
};

var reduce = function(key, countDurationObjs) {
    // the output of the reduce() function must have the same type emitted by map() function
    var reducedValue = {count:0, duration: 0};
    for (var idx = 0; idx < countDurationObjs.length; idx++) {
        reducedValue.count += countDurationObjs[idx].count;
        reducedValue.duration += countDurationObjs[idx].duration;
    }
    return reducedValue;
}

var finalize = function(key, reducedValue) {
    reducedValue.average = Math.round(reducedValue.duration / reducedValue.count);
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
    db.prod.mapReduce(map, reduce, {finalize: finalize,  out:{inline:1}, query: {duration: {$exists:1}, dest_host:'stageb-mobile.whitepages.com.au'}})
);

// debug functions
var emit = function(key, value) {
        print("emit");
        print("key: " + key + "  value: " + tojson(value));
}

var myCursor = db.prod.find({$exists: {duration:1} })

while (myCursor.hasNext()) {
    var doc = myCursor.next();
    map.apply(doc);
}