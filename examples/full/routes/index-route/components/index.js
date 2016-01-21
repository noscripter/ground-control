/* eslint-disable new-cap */

import React from 'react';
import { createReducer } from 'redux-act';
// import { combineReducers } from 'redux';
import { loop, Effects, combineReducers } from 'redux-loop';
import { Map } from 'immutable';

import createActions from 'examples/utils/createActions';
import { routeStyle, flashStyle } from 'examples/utils/style';

export const actions = createActions('IndexRoute', ['update', 'step1', 'step2', 'step3', 'step4', 'step5']);

const palindrome = 'tacocat';

const forwards = createReducer({
  [actions.update]: (state, payload) => {
    return state.set('value', payload);
  },
}, Map({ value: palindrome })); // support for immutable.js/etc w/ deserializer

const backwards = createReducer({
  [actions.update]: (state, payload) => {
    return payload.split('').reverse().join('');
  },
}, palindrome);

const loopExample = createReducer({
  [actions.step1]: () => loop(1, Effects.constant(actions.step2, actions.step3, actions.step4, actions.step5)),
  [actions.step2]: () => 2,
  [actions.step3]: () => 3,
  [actions.step4]: () => 4,
  [actions.step5]: () => 5,
}, 'Click to Loop!');

export const reducer = combineReducers({ // and for combinedReducers. whatever you want
  forwards,
  backwards,
  loopExample,
});

export default props => {
  const { dispatch, data, location } = props;
  const valueForwards = data.forwards.value;
  const valueBackwards = data.backwards;

  let redirectedMessage;
  if (location.query && location.query.redirected) {
    redirectedMessage = <p style={flashStyle}>Redirected!</p>;
  }

  return (
    <div style={routeStyle}>
      {redirectedMessage}
      <p style={{marginTop: 0}}>{valueBackwards}&nbsp;</p>
      <input
        type="text"
        style={{width: '100%', padding: 10, boxSizing: 'border-box'}}
        value={valueForwards}
        placeholder={palindrome}
        onChange={(e) => {
          dispatch(actions.update(e.target.value));
        }}
        />
      <p onClick={() => { dispatch(actions.step1()); }}>{data.loopExample}</p>
    </div>
  );
};
