const BACKEND_URL = 'https://caffinity.co/backend/api'

//fetch all cafes from mongo
export const cafeFetchMongo = () => {
    return (dispatch) => {
        fetch(`${BACKEND_URL}/getData`)
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
        fetch(`${BACKEND_URL}/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
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

export const setLocation = (lat, lng, rad, id=null) => {
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
        dispatch(
            {
                type: 'set_range',
                payload: rad
            }
        )
        fetch(`${BACKEND_URL}/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
        .then(data => data.json())
        .then(res => {
            //console.log(res.data)
            dispatch({ type: 'get_cafe_data', payload: res.data })
            if (id) {
                
                var result = res.data.filter(cafe => {
                    return cafe._id === id
                })
                console.log(result[0])
                dispatch({ type: 'set_selection', payload: result[0] })
            }
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
        fetch(`${BACKEND_URL}/getRange/${minLat}/${maxLat}/${minLng}/${maxLng}`)
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

/** Safely parse json or reject. */
function jsonParser(response) {
    if (!response.ok) {
        return Promise.reject(response)
    }
    return response.json()
}
//login a user
export const login = (username, password) => {
    return dispatch => {
        let body = new URLSearchParams();
        body.append('username', username);
        body.append('password', password);
        return fetch(`${BACKEND_URL}/login`, {
            credentials: 'include',
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(jsonParser).then(response => {
            return dispatch({
                type: 'login',
                payload: response.username,
            })
        })
    }
}
//logout
export const logout = () => {
    return dispatch => {
        return fetch(`${BACKEND_URL}/logout`, {
            credentials: 'include',
        }).then(response => {
            return dispatch({
                type: 'logout'
            })
        })
    }
}

export const setMap = () => {
    return {
        type: 'set_map',
        payload: null
    }
}

export const setList = () => {
    return {
        type: 'set_list',
        payload: null
    }
}

export const togglePane = () => {
    return {
        type: 'toggle_pane',
        payload: null
    }
}

export const setSelection = (cafe) => {
    console.log(cafe)
    return {
        type: 'set_selection',
        payload: cafe
    }
}

export const clearSelection = () => {
    return {
        type: 'clear_selection',
        payload: null
    }
}