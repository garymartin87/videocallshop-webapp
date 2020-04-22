import { combineReducers } from 'redux';

import callRequestReducer from './callRequestReducer';

export default combineReducers({
    callRequest: callRequestReducer,
});
