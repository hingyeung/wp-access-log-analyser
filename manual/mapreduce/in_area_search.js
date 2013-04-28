var map = function() {
    var getDistanceFromLatLonInKm = function(lat1, lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    var deg2rad = function(deg) {
      return deg * (Math.PI/180)
    }

    var updateResult = function (doc, result) {
        var inArea = getDistanceFromLatLonInKm(doc.cur_loc.lat, doc.cur_loc.lon, doc.geocode[0], doc.geocode[1]) < 2;

        if (doc.wp_request_params == null) {
            return;
        }

        if (doc.wp_request_params.indexOf('business')) {
            result.busTotal = 1;
            if (inArea) {result.busInArea = 1;}
        } else if (doc.wp_request_params.indexOf('government')) {
            result.govTotal = 1;
            if (inArea) {result.govInArea = 1;}
        } else if (doc.wp_request_params.indexOf('residential')) {
            result.resTotal = 1;
            if (inArea) {result.resInArea = 1;}
        }
    }

    var result = {
        busTotal: 0,
        govTotal: 0,
        resTotal: 0,
        busInArea: 0,
        govInArea: 0,
        resInArea: 0
    };

    // TODO: rename cur_loc to search_loc_geocode and geocode to gps_loc. This is too confusing
    if (this.cur_loc != null && this.geocode != null) {
        updateResult(this, result);
        emit('inArea', result);
    }
};

//var emit = function(key, value) {
//    print('key: ' + key);
//    print('value: ' + tojson(value));
//}

var reduce = function(key, values) {
    var reducedValues = {
        busTotal:0,
        govTotal:0,
        resTotal:0,
        busInArea:0,
        govInArea:0,
        resInArea:0
    };

    for (var idx = 0; idx < values.length; idx++) {
        reducedValues.busTotal += values[idx].busTotal;
        reducedValues.govTotal += values[idx].govTotal;
        reducedValues.resTotal += values[idx].resTotal;
        reducedValues.busTotal += values[idx].busTotal;
        reducedValues.govTotal += values[idx].govTotal;
        reducedValues.resTotal += values[idx].resTotal;
    }

    return reducedValues;
};

db.prod_search_0_hour.mapReduce(
    map,
    reduce,
    { out:"map_reduce_example" }
);
