var map = function () {
    var type = getRequestType(this.uri_path);

    if (type == 'Searches') {
        var location = getRequestParamValue(this.uri_query, 'location');
        if (location == 'Current+Location') {
            emit(type, {useCurPos:1, notUseCurPos:0});
        } else {
            emit(type, {useCurPos:0, notUseCurPos:1});
        }
    }
}

var reduce = function (key, values) {
    var reducedValue = {useCurPos:0, notUseCurPos:0};
    for (var idx = 0; idx < values.length; idx++) {
        reducedValue.useCurPos += values[idx].useCurPos;
        reducedValue.notUseCurPos += values[idx].notUseCurPos;
    }
    return reducedValue;
}

var mapReduceToNestArray = function(mapReduceResult) {
    return [['Current location', mapReduceResult.results[0].value.useCurPos], ['Other locations', mapReduceResult.results[0].value.notUseCurPos]];
}

mapReduceToNestArray(
    db.prod.mapReduce(map, reduce, {out:{inline:1}, query:{uri_query:{$exists:1}}})
);