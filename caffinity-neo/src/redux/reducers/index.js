import { combineReducers } from 'redux';

import CafeFetchReducer from './CafeFetchReducer';
import LocationReducer from './LocationReducer';
import FilterReducer from './FilterReducer';
import UserReducer from './UserReducer';
import MobilePane from './MobilePane';
import SelectionReducer from './SelectionReducer';

export default combineReducers({
    cafe: CafeFetchReducer, //list of cafes
    location: LocationReducer, //user's location (chosen and actual)
    filters: FilterReducer, //list filters
    user: UserReducer, //user
    mobilePane: MobilePane, //show list or map (mobile only)
    selection: SelectionReducer,
});
