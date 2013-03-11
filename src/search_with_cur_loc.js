var map = function () {
    var type = getRequestType(this.uri_path);

    if (type == 'Searches') {
        if (this.uri_query.match(/lat=/) && this.uri_query.match(/lon=/)) {
            emit(type, {hasCurPos: 1, hasNoCurPos: 0});
        } else {
            emit(type, {hasCurPos: 0, hasNoCurPos: 1});
        }
    }
}

var reduce = function (key, values) {
    var reducedValue = {hasCurPos: 0, hasNoCurPos: 0};
    for (var idx = 0; idx < values.length; idx++) {
        reducedValue.hasCurPos += values[idx].hasCurPos;
        reducedValue.hasNoCurPos += values[idx].hasNoCurPos;
    }
    return reducedValue;
}

var mapReduceToNestArray = function(mapReduceResult) {
    return [['Using current location', mapReduceResult.results[0].value.hasCurPos], ['Not using current location', mapReduceResult.results[0].value.hasNoCurPos]];
}

mapReduceToNestArray(db.prod.mapReduce(map, reduce, {out:{inline:1}, query:{uri_query:{$exists:1}}}));