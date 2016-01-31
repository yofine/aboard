import _ from 'lodash';
import request from 'superagent';
import * as ActionTypes from '../ActionTypes';

export function load() {

  return (dispatch, getState) => {

    var url = '/api/session';
    dispatch({
      type: ActionTypes.SESSION_LOADING
    });

    request
      .get(url)
      .set('authorization', '7cd88aab19d17e518a25d223476f53d5f10258d3')
      .end(function(err, res) {
        if (err) {
          dispatch({
            type: ActionTypes.SESSION_LOAD_FAILURE,
            errors: {
              msg: 'Failed to load api',
              stack: ex
            }
          });
        } else {
          dispatch({
            type: ActionTypes.SESSION_LOAD_SUCCESS,
            session: res.body
          });
      }});
  };
}

