import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, SignUp, ResetPassword, ChangePassword } from "../src/pages";
import Routes from "../src/routes";
import { store } from '../src/store';
import { api } from '../src/api';
import Context from '../src/context';
import 'react-tippy/dist/tippy.css';

class Root extends Component {
  constructor(props) {
      super(props);
      this.store = store;
      this.state = this.store.state;
      this.store.setStateHandler(this.setState.bind(this));
  }

  // bootIntercom(user) {
  //   if (user.id)
  //     window.Intercom('boot', {
  //       app_id: 'ui27tgvx',
  //       email: user.email,
  //       user_id: user.id,
  //       created_at: user.created_at,
  //       user_hash: user.intercom_hmac,
  //     });
  // }

  render() {
    return (
      <Context.Provider value={{ api, state: this.state }} >
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/sign_up" component={SignUp}/>
            <Route exact path="/reset_password" component={ResetPassword}/>
            <Route exact path="/change_password/:token" component={ChangePassword}/>
            <Route component={Routes}/>
          </Switch>
        </Router>
        <footer>
          <div id="footer-top">Footer Top</div>
          <div id="footer-bottom">Footer Bottom</div>
        </footer>
      </Context.Provider>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.body.appendChild(document.createElement('div')),
  )
});
