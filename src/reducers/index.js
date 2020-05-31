import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

import callRequestReducer from './callRequestReducer';
import callReducer from './callReducer';

export default combineReducers({
    callRequest: callRequestReducer,
    call: callReducer,
    toastr: toastrReducer,
});
