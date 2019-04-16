import firebase from 'firebase';

export const cityCheck = (city) => {
    return (dispatch) => {
        firebase.database().ref(`/${city}/`)
            .on('value', snapshot => {

                const cityObj = {
                    "name": "Los Angeles"
                };

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

export const cafeFetchMongo = () => {
    return (dispatch) => {
        fetch("http://localhost:3001/api/getData")
        .then(data => data.json())
        .then(res => {
            console.log(res.data)
            dispatch({ type: 'get_cafe_data', payload: res.data })
        })
    };
}

//1d lat = 70mi -> 1mi = 1/60 deg
//longitude: = cos(lat deg) * miles
export const cafeFetchSelectionMongo = (lat, lng, rad) => {
    var minLat = lat - 0.0166666*rad;
    var maxLat = lat + 0.0166666*rad;
    var minLng = lng - Math.cos(lat*Math.PI/180)*rad;
    var maxLng = lng + Math.cos(lat*Math.PI/180)*rad;

    console.log(lat+'+'+lng+'+'+rad);
    console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)
    return (dispatch) => {
        fetch(`http://localhost:3001/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
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

    console.log(lat+'+'+lng+'+'+rad);
    console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)

    return (dispatch) => {
        dispatch(
            {
                type: 'set_location',
                payload: { lat, lng }
            }
        )
        fetch(`http://localhost:3001/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
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
    var minLng = lng - Math.cos(lat*Math.PI/180)*rad;
    var maxLng = lng + Math.cos(lat*Math.PI/180)*rad;

    console.log(lat+'+'+lng+'+'+rad);
    console.log(minLat+'-'+maxLat+'-'+minLng+'-'+maxLng)

    return (dispatch) => {
        dispatch(
            {
                type: 'set_range',
                payload: rad
            }
        )
        fetch(`http://localhost:3001/api/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
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