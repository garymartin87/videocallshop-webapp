import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

import callRequestReducer from './callRequestReducer';

export default combineReducers({
    callRequest: callRequestReducer,
    toastr: toastrReducer,
});
