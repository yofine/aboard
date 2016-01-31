import _ from 'lodash';
import Immutable from 'immutable'
import { combineReducers } from 'redux';
import * as ActionTypes from '../ActionTypes';
import createReducer from '../lib/createReducer';


const initialState = Immutable.fromJS({
  name: null,
  guest: null,
  avatar: null,
  email: null
});


export default createReducer(initialState, {

  [ActionTypes.SESSION_LOAD_SUCCESS](state, action) {

    return state.withMutations(map => {
      map
        .set('guest', action.session.guest || false)
        .set('name', action.session.name)
        .set('avatar', action.session.avatar)
        .set('email', action.session.email)
    });
  },

});
