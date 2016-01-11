import React from 'react';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import { simpleConnect } from 'modules/AsyncNestedRedux';

import _AppComponent from 'easy-example/components';
import HomeComponent, { reducer as homeReducer } from 'easy-example/components/home';
import Route2Component, { reducer as route2Reducer, fetchData as route2FetchData } from 'easy-example/components/route-2';

// connect top level only & everything is automatic.
const AppComponent = simpleConnect(connect, _AppComponent);

// adjusted route api...
// {
//   path,
//   component,
//   childRoutes,
//   getChildRoutes,
//   ...
//   reducer (optional),
//   fetchData (optional),
//   loader (optional),
// }

// routes can be defined using jsx, or as an object (my preference, especially with larger app)
export default (
  <Route path="/" component={AppComponent}>
    <IndexRoute component={HomeComponent} reducer={homeReducer} />
    <Route path="/route-2" component={Route2Component} reducer={route2Reducer} fetchData={route2FetchData} />
  </Route>
);