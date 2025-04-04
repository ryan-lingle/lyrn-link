import React from "react";
import {
  Route,
  Redirect
} from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return(
    <Route {...rest} render={(props) => (
      localStorage.getItem('authToken') != null
        ? <Component {...props} />
        : <Redirect to={{
          pathname: '/signin',
          state: { from: props.location.pathname }
        }} />
    )} />
  )
}

export default PrivateRoute;
