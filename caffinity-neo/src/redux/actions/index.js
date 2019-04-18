import firebase from 'firebase';

//deprecated
export const cityCheck = (city) => {
    return (dispatch) => {
        firebase.database().ref(`/${city}/`)
            .on('value', snapshot => {

                if (snapshot.val() == null) {
                    firebase.database().ref('/').child(city).update({
                        'cafes': '',
                        'name': city,
                        'lat': 0,
                        'lng': 0
                    });
                }
                else {
                    dispatch({ type: 'get_cafe_data', payload: snapshot.val() });
                }
            });
    }
}

//deprecated
export const cafeFetch = (city) => {
    //console.log("fetch start");
    return (dispatch) => {
        firebase.database().ref(`/${city}/`)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    dispatch({ type: 'get_cafe_data', payload: snapshot.val() });
                }
            }, error => {
                console.error(error);
            });
    };
};

//fetch all cafes from mongo
export const cafeFetchMongo = () => {
    return (dispatch) => {
        fetch("https://caffinity.co/backend/api/getData")
        .then(data => data.json())
        .then(res => {
            console.log(res.data)
            dispatch({ type: 'get_cafe_data', payload: res.data })
        })
    };
}

//fetch cafes within a square of size rad around lat, lng
export const cafeFetchSelectionMongo = (lat, lng, rad) => {
    //1d lat = 70mi -> 1mi = 1/60 deg
    //longitude: = cos(lat deg) * miles
    var minLat = lat - 0.0166666*rad;
    var maxLat = lat + 0.0166666*rad;
    var minLng = lng - 0.0166666*Math.cos(lat*Math.PI/180)*rad;
    var maxLng = lng + 0.0166666*Math.cos(lat*Math.PI/180)*rad;

    console.log(lat+'+'+lng+'+'+rad);
    console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)
    return (dispatch) => {
        fetch(`https://caffinity.co/backend/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
        .then(data => data.json())
        .then(res => {
            console.log(res.data)
            dispatch({ type: 'get_cafe_data', payload: res.data })
        })
    };
}

export const getLocation = (loc) => {
    //console.log("get")
    return {
        type: 'get_location',
        payload: loc
    }
}

export const setLocation = (lat, lng, rad) => {
    var minLat = lat - 0.0166666*rad;
    var maxLat = lat + 0.0166666*rad;
    var minLng = lng - 0.0166666*Math.cos(lat*Math.PI/180)*rad;
    var maxLng = lng + 0.0166666*Math.cos(lat*Math.PI/180)*rad;

    //console.log(lat+'+'+lng+'+'+rad);
    //console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)

    return (dispatch) => {
        dispatch(
            {
                type: 'set_location',
                payload: { lat, lng }
            }
        )
        fetch(`https://caffinity.co/backend/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
        .then(data => data.json())
        .then(res => {
            //console.log(res.data)
            dispatch({ type: 'get_cafe_data', payload: res.data })
        })
    }
    /*
    return {
        type: 'set_location',
        payload: { lat, lng }
    }*/
}

export const setGeoLocation = (lat, lng) => {
    return {
        type: 'set_geo_location',
        payload: { lat, lng }
    }
}

export const setRange = (lat, lng, rad) => {
    var minLat = lat - 0.0166666*rad;
    var maxLat = lat + 0.0166666*rad;
    var minLng = lng - 0.0166666*Math.cos(lat*Math.PI/180)*rad;
    var maxLng = lng + 0.0166666*Math.cos(lat*Math.PI/180)*rad;

    //console.log(lat+'+'+lng+'+'+rad);
    //console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)

    return (dispatch) => {
        dispatch(
            {
                type: 'set_range',
                payload: rad
            }
        )
        fetch(`https://caffinity.co/backend/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
        .then(data => data.json())
        .then(res => {
            dispatch({ type: 'get_cafe_data', payload: res.data })
        })
    }
}

export const distsort = (lat, lng) => {
    //console.log("SORTLOC")
    return {
        type: 'cafe_sort_location',
        payload: { lat, lng }
    }
}

export const toggleFilterWifi = () => {
    return {
        type: 'toggle_wifi',
        payload: null
    }
}

export const toggleFilterPower = () => {
    return {
        type: 'toggle_power',
        payload: null
    }
}

export const toggleFilterFood = () => {
    return {
        type: 'toggle_food',
        payload: null
    }
}