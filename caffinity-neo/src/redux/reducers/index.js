import { combineReducers } from 'redux';

import CafeFetchReducer from './CafeFetchReducer';
import LocationReducer from './LocationReducer';
import FilterReducer from './FilterReducer';
import UserReducer from './UserReducer';
import MobilePane from './MobilePane';

export default combineReducers({
    cafe: CafeFetchReducer,
    location: LocationReducer,
    filters: FilterReducer,
    user: UserReducer,
    mobilePane: MobilePane,
});
