const INITIAL_STATE = {
    current: {
        lat: 37.7749,
        lng: -122.4194
    },
    geo: {
        lat: 37.7749,
        lng: -122.4194
    },
    range: 3
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'get_location':
            //return location
            return action.payload;
        case 'set_location':
            //set current location for map focus
            return { ...state, current: { lat: action.payload.lat, lng: action.payload.lng } };
        case 'set_geo_location':
            //set user's geolocation
            return { ...state, geo: { lat: action.payload.lat, lng: action.payload.lng } };
        case 'set_range':
            return { ...state, range: action.payload };
        default:
            return state;
    }
};
