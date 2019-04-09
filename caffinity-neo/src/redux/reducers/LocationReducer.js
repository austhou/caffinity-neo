const INITIAL_STATE = {
    lat: 37.7749,
    lng: -122.4194
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'get_location':
            //console.log(action.payload);
            return action.payload;
        case 'set_location':
            //console.log(action.payload);
            return { lat: action.payload.lat, lng: action.payload.lng };
        default:
            return state;
    }
};
