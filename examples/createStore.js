import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { syncHistory } from 'redux-simple-router';
import DevTools from 'examples/utils/devtools';
import { isEmpty } from 'lodash';
import thunk from 'redux-thunk';
import { ANR_ROOT } from 'modules/AsyncNestedRedux';

export default ({
  additionalReducers,
  enableReduxSimpleRouter,
  enableDevTools,
  enableThunk,
  initialState,
  history,
}) => {
  let middleware = [];
  let reduxSimpleRouterMiddleware;
  if (enableThunk) middleware = middleware.concat(thunk);
  if (enableReduxSimpleRouter && history) reduxSimpleRouterMiddleware = syncHistory(history);
  if (reduxSimpleRouterMiddleware) middleware = middleware.concat(reduxSimpleRouterMiddleware);

  let storeEnhancers = [];
  if (enableDevTools) storeEnhancers = storeEnhancers.concat(DevTools.instrument());

  const finalCreateStore = compose(
    applyMiddleware(...middleware),
    ...storeEnhancers
  )(createStore);

  const defaultReducer = (state = {}) => state;
  const store = finalCreateStore(
    !isEmpty(additionalReducers) ? combineReducers({
      ...additionalReducers,
      [ANR_ROOT]: defaultReducer,
    }) : defaultReducer,
    initialState
  );

  if (reduxSimpleRouterMiddleware) {
    reduxSimpleRouterMiddleware.listenForReplays(store);
  }

  return store;
};