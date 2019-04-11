import _ from 'lodash';

function distanceR(lat1, lon1, lat2, lon2, unit) {    
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit==="K") { dist = dist * 1.609344 }
    if (unit==="N") { dist = dist * 0.8684 }
    return dist;
}


export default (state = null, action) => {
    //console.log(action);
    switch (action.type) {
        case 'get_cafe_data':
            return action.payload;
        case 'cafe_sort':
            const stateArr = _.map(state, (val, uid) => {
                return { ...val };
            });

            const sorted = _.clone(stateArr.sort(function(a, b) {
                var x = a[action.payload];
                var y = b[action.payload];
        
                if (typeof x == "string")
                {
                    x = (""+x).toLowerCase(); 
                }
                if (typeof y == "string")
                {
                    y = (""+y).toLowerCase();
                }
        
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }), true);

            return sorted;
        case 'cafe_sort_inner':
            const stateArrI = _.map(state, (val, uid) => {
                return { ...val };
            });

            const sortedI = _.clone(stateArrI.sort(function(a, b) {
                var x = a["attributes"][action.payload];
                var y = b["attributes"][action.payload];
        
                if (typeof x === "string")
                {
                    x = (""+x).toLowerCase(); 
                }
                if (typeof y === "string")
                {
                    y = (""+y).toLowerCase();
                }
        
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }), true);

            return sortedI;


        case 'cafe_sort_location':
            const stateArrL = _.map(state, (val, uid) => {
                return { ...val };
            });

            const sortedL = _.clone(stateArrL.sort(function(a, b) {

                //action.payload = { lat, lng }
                var alat = a["lat"];
                var alng = a["lng"];
                var blat = b["lat"];
                var blng = b["lng"];

                var x = distanceR(alat,alng,action.payload.lat,action.payload.lng,"M");
                var y = distanceR(blat,blng,action.payload.lat,action.payload.lng,"M");

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }), true);
            //console.log(sortedL);
            return sortedL;
        default:
            return state;
    }
};
