import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, TwitterCallback, List } from "../src/pages";
import Routes from "../src/routes";
import { store } from '../src/store';
import { api } from '../src/api';
import Context from '../src/context';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
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
      <Context.Provider value={{ api, state: this.state, store }} >
        <DndProvider backend={HTML5Backend}>
          <Router>
            <Switch>
              <Route exact path="/sign_in" component={Login}/>
              <Route exact path="/twitter/callback" component={TwitterCallback} />
              <Route exact path="/u/:username/" component={List} />
              <Route exact path="/u/:username/:listType" component={List} />
              <Route component={Routes}/>
            </Switch>
          </Router>
          <footer>
            <div id="footer-top">Footer Top</div>
            <div id="footer-bottom">Footer Bottom</div>
          </footer>
        </DndProvider>
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
