import React, { useContext } from 'react';
import {
  Admin,
  AdminList,
  List,
  Users,
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
                <PrivateRoute path="/admin" exact component={Admin} />
                <PrivateRoute path="/admin/:listType" exact component={Admin} />
                <Route exact path="/:handle/" component={List} />
                <Route exact path="/:handle/:listType" component={List} />
                <Route component={_404_} />
              </Switch>
          </div>
      </div>
    )
}

export default Routes;