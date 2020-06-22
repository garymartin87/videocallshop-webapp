import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

import callRequestReducer from './callRequestReducer';
import callReducer from './callReducer';
import storeReducer from './storeReducer';

export default combineReducers({
    callRequest: callRequestReducer,
    call: callReducer,
    stores: storeReducer,
    toastr: toastrReducer,
});
