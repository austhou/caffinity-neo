const INITIAL_STATE = {
    filterWifi: false,
    filterPower: false,
    filterFood: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'toggle_wifi':
            return {...state, filterWifi: !state.filterWifi}
        case 'toggle_power':
            return {...state, filterPower: !state.filterPower}
        case 'toggle_food':
            return {...state, filterFood: !state.filterFood}
        default:
            return state;
    }
};
