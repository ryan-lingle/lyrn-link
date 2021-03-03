import React, { useContext } from 'react';
import {
  Users,
  Page,
  _404_,
  Group,
} from "./pages";
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar, ErrorBox } from './components';
import Context from './context';

const Routes = () => {
    const { state } = useContext(Context);

    return(
      <div>
        <Route exact component={NavBar} />
        <ErrorBox error={state.errors.standard} />
        <Switch>
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute path="/admin" exact component={Page} />
          <PrivateRoute path="/admin/:tab" exact component={Page} />
          <PrivateRoute path="/admin/:tab/:tabType" exact component={Page} />
          <Route path="/g/:handle" exact component={Group} />
          <Route exact path="/:handle/" component={Page} />
          <Route exact path="/:handle/:tab" component={Page} />
          <Route exact path="/:handle/:tab/:tabType" component={Page} />
          <Route component={_404_} />
        </Switch>
      </div>
    )
}

export default Routes;