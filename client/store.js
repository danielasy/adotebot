import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import { tweetsToReviewReducer } from './reducers';

export const initStore = (initialState = {}) => {
  return createStore(
    combineReducers({
      tweetsToReview: tweetsToReviewReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
