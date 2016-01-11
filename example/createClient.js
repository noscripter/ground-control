import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import domready from 'domready';
import AsyncRedux from 'modules/AsyncRedux';

export default (routes, initializeStore, createApp) => {
  const routerProps = (history, store) => ({
    routes,
    history,
    render: props => (
      <AsyncRedux {...props} store={store} />
    ),
  });

  const store = initializeStore();
  const app = createApp(store, <Router {...routerProps(browserHistory, store)} />);

  domready(() => {
    render(app, document.getElementById('app'));
  });
};