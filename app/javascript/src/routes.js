import React, { useContext } from 'react';
import {
  Users,
  Page,
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
                <PrivateRoute exact path="/users" component={Users} />
                <PrivateRoute path="/admin" exact component={Page} />
                <PrivateRoute path="/admin/:tab" exact component={Page} />
                <PrivateRoute path="/admin/:tab/:listType" exact component={Page} />
                <Route exact path="/:handle/" component={Page} />
                <Route exact path="/:handle/:tab" component={Page} />
                <Route exact path="/:handle/:tab/:listType" component={Page} />
                <Route component={_404_} />
              </Switch>
          </div>
      </div>
    )
}

export default Routes;