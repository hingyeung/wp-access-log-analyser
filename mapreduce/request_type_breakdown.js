
var map = function () {
//    var uri_path = this.uri_path;
//    if (uri_path.indexOf(';') != -1) {
//        uri_path = uri_path.substring(0, uri_path.indexOf(';'));
//    }

    var type = getRequestType(this.uri_path);

    var count = 1;
    emit(type, count);
}

var reduce = function (key, counts) {
    return Array.sum(counts);
}

var mapReduceToNestArray = function(mapReduceResult) {
    var nestedArray = [], results = mapReduceResult.results;
    for (var idx = 0; idx < results.length; idx++) {
        nestedArray.push([results[idx]._id, results[idx].value]);
    }
    return nestedArray;
}

var mapReduceToChartData = function(mapReduceResult, chartName) {
    var results = mapReduceResult.results;
    var data = [];
    for (var idx = 0; idx < results.length; idx++) {
        data.push([results[idx]._id, results[idx].value]);
    }
    db.chartData.update({chartName: chartName}, {$set: {data: data, chartType: 'pie'}}, {upsert: true});
}

mapReduceToNestArray(db.prod.mapReduce(map, reduce, {out:{inline:1}, query: {dest_host:'stageb-mobile.whitepages.com.au'}}));

mapReduceToChartData(db.prod.mapReduce(map, reduce, {out:{inline:1}, query: {dest_host:'stageb-mobile.whitepages.com.au'}}), 'requestTypeBreakdown');


//
//var emit = function(key, value) {
//    if (key == 'othres') {
//        print("emit");
//        print("key: " + key + "  value: " + tojson(value));
//    }
//}
//
//var myCursor = db.prod.find({ dest_host:'mobile.whitepages.com.au'});
//while (myCursor.hasNext()) {
//    var doc = myCursor.next();
//
////    print("document _id= " + tojson(doc._id));
//    map.apply(doc);
//        print();
//}