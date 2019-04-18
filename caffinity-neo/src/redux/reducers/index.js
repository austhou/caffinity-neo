import { combineReducers } from 'redux';

import CafeFetchReducer from './CafeFetchReducer';
import LocationReducer from './LocationReducer';
import FilterReducer from './FilterReducer';

export default combineReducers({
    cafe: CafeFetchReducer,
    location: LocationReducer,
    filters: FilterReducer,

});
