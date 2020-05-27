import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateComponent = ({ component, exact = false, path, authenticated }) => (
  <Route
    exact={exact}
    path={path}
    render={ () => (
      authenticated ? (
        React.createElement(component)
      ) : (
        <Redirect to={{
          pathname: '/'
        }}/>
      )
    )}
  />
);

export default PrivateComponent;