import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export function distance (lat1, lon1, lat2, lon2, unit) {
    //console.log(lat1);
    //console.log(lon1);
    //console.log(lat2);
    //console.log(lon2);
    
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

    var dec = 1;
    if (dist > 99.9) {
        dec = 0;
    }
    return dist.toFixed(dec);
}

export function updateURL (lat, lon, range, id) {
    const searchParams = new URLSearchParams();
    searchParams.set("lat", lat);
    searchParams.set("lon", lon);
    searchParams.set("r", range);
    searchParams.set("id", id);
    //browserHistory.push(`?${searchParams.toString()}`);
    history.push({
        search: `?${searchParams.toString()}`,
    });   
}