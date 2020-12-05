import React, { useContext } from 'react';
import {
  Admin,
  AdminList,
  Profile,
  _404_,
} from "./pages";
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar, ErrorBox } from './components';
import Context from './context';

const Routes = () => {
    const { state } = useContext(Context);

    return(
      <div>
          <div className="container">
              <ErrorBox error={state.errors.standard} />
              <Switch>
                <PrivateRoute path="/admin" exact component={Admin} />
                <PrivateRoute path="/admin/:listType" exact component={Admin} />
                <PrivateRoute path="/profile" exact component={Profile} />
                <Route component={_404_} />
              </Switch>
          </div>
      </div>
    )
}

export default Routes;