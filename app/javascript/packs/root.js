import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, SignUp, TwitterCallback, ConfirmEmail } from "../src/pages";
import Routes from "../src/routes";
import { store } from '../src/store';
import { api } from '../src/api';
import Context from '../src/context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

class Root extends Component {
  constructor(props) {
      super(props);
      this.store = store;
      this.state = this.store.state;
      this.store.setStateHandler(this.setState.bind(this));
  }

  signOut = () => {
    localStorage.clear();
    window.location.href = "/";
  }


  render() {

    return (
      <Context.Provider value={{ api, state: this.state }} >
        <DndProvider backend={HTML5Backend}>
          <Router>
            <Switch>
              <Route exact path="/signin" component={Login}/>
              <Route exact path="/signup" component={SignUp}/>
              <Route exact path="/twitter/callback" component={TwitterCallback} />
              <Route exact path="/confirm_email/:token" component={ConfirmEmail} />
              <Route component={Routes}/>
            </Switch>
          </Router>
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
