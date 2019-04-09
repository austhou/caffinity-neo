import { combineReducers } from 'redux';

import CafeFetchReducer from './CafeFetchReducer';
import LocationReducer from './LocationReducer';

export default combineReducers({
    cafe: CafeFetchReducer,
    location: LocationReducer,
    //auth: AuthReducer,

});
