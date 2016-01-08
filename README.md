# AsyncRedux

opinionated new friend for react-router that aims to simplify
the react/redux/react-router setup by giving a bit more power to your routes.

javascript fatigue is real...make your life easier with AsyncRedux!

## TODO
- [x] Route based reducer organization
- [ ] Data fetching lifecycle
- [ ] Server side rendering
- [ ] getReducer to align with getComponent
- [ ] Make the example app (code) pretty
- [ ] Tests

### First class data fetching

- opinion: co-located component data fetching only makes sense with a sophisticated, declarative data fetching service (graphql, falcor). custom endpoints are better handled at router level.
- optimal loading control - easily specify exactly when to render route component on server / client. ex - on server, fetch 'top of page' data blocking render, finish loading 'bottom of page' data on client. on client, render 'preview template' immediately & fetch async.

### Route based reducer organization

- opinion: react is easy. redux is easy. react-router is easy. all 3 combined is hard! organizing reducers in line with routing structure simplifies overall application state and helps react-router & redux get along (without redux-simple-router, etc).
- automatic nested reducers - reducers are nested in line with routing structure. when a route changes, the corresponding state is cleared & replaced with the reducer for the new route. this preserves state associated with the parent route reducer. this mimics a server side refresh, but lets developer store certain state a level higher to persist data.

---

###### Data fetching...
*You can do a lot - everything is optional.*
```javascript
fetchData(params, dispatch, done, clientReady, clientHydrated, serverReady) {
  // render generic loading template
  clientReady(); // render preview template

  const promise1 = new Promise((resolve, reject) => {
    if (clientHydrated) { // initial load, skip fetch
      resolve();
    } else {
      fetch('endpoint').then(response => {
        dispatch(actionAssociatedWithRouteReducer());
        serverReady(); // block server until...
        resolve();
      });
    }
  });

  // on server, only load 'top of page' data.
  if (__CLIENT__) { // finish loading on client.
    const promise2 = new Promise((resolve, reject) => {
      fetch('endpoint').then(response => {
        dispatch(actionAssociatedWithRouteReducer());
        resolve();
      });
    });

    Promise.all([promise1, promise2]).then(() => {
      done(); // w00t. loading = false.
    });
  }
}
```

###### Nested reducers...
*Look like this, but @@child is hidden from developer.*
```
{
  counter,
  @@child: {
    counter,
    @@child: {
      counter
    }
  }
}
```

###### Isolated reducers...
*A child can't access parent. If you need to, use thunk.*
```javascript
thunkedAction = () => (dispatch, getState) {
  const applicationCounter = getState().counter;
  dispatch(nestedRouteAction.incr(applicationCounter));
}
```

###### Component data...
*Automatically pass in nested data to nested routes.*
```javascript
// { counter: 0, ['@@CHILD']: { counter: 0 }}

const ParentRouteComponent = ({ children, data, dispatch }) => {
  return (
    <div>
      <p onClick={() => {dispatch(actions.incr());}}>{data.counter}</p>
      {renderChildren(children, data, dispatch)}
    </div>
  );
};

const ChildRouteComponent = ({ data, dispatch }) => {
  return (
    <p onClick={() => {dispatch(actions.incr());}}>{data.counter}</p>
  );
};
```

### How to use...
[See example implementation]('todo')

---

**Special thanks to [ryan florence](https://github.com/ryanflorence), largely based on [aync-props](https://github.com/rackt/async-props)!**
