import React, { useContext, useEffect } from 'react';
import * as Pages from "./pages";
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute, NavBar, ErrorBox } from './components';
import Context from './context';
import { withStuff } from "./hocs";

const routes = [
  {
    path: "/users",
    page: "Users",
    private: true,
  },
  {
    path: '/change_password/:token',
    page: 'ResetPassword',
    nav: false,
  },
  {
    path: '/reset_password',
    page: 'RequestResetPassword',
    nav: false,
  },
  {
    path: "/settings",
    page: "Settings",
    private: true,
  },
  {
    path: "/admin",
    page: "Page",
    private: true,
  },
  {
    path: "/admin/:tab",
    page: "Page",
    private: true,
  },
  {
    path: "/admin/:tab/:tabType",
    page: "Page",
    private: true,
  },
  {
    path: "/g/:handle",
    page: "Group",
  },
  {
    path: "/g/:handle/i/:item",
    page: "Group",
  },
  {
    path: "/g/:handle/:tab",
    page: "Group",
  },
  {
    path: "/g/:handle/:tab/:tabType",
    page: "Group",
  },
  {
    path: "/i/:item",
    page: "Page",
  },
  {
    path: "/:handle",
    page: "Page",
  },
  {
    path: "/:handle/i/:item",
    page: "Page",
  },
  {
    path: "/:handle/:tab",
    page: "Page",
  },
  {
    path: "/:handle/:tab/:tabType",
    page: "Page",
  }
];

const buildComponent = ({
  path,
  page,
  nav = true,
  ...config
}) => {
  const Page = withStuff(Pages[page], config);

  return (props) => {
    const { state } = useContext(Context);

    return (
      <div>
        {nav && <Route exact component={NavBar} />}
        <ErrorBox error={state.errors.standard} />
        <Page {...props} />
      </div>
    );
  };
};

const buildRoutes = (routes) => {
  routes = routes.map((route) => {
    route.Component = buildComponent(route);
    return route;
  });


  const _404_ = buildComponent({
    page: "_404_",
    stripeBanner: false,
  });

  return () => {
    const { state } = useContext(Context);

    return (
      <div>
        <Switch>
          {routes.map((route, i) =>
            route.private ? (
              <PrivateRoute
                key={i}
                path={route.path}
                exact
                component={route.Component}
              />
            ) : (
              <Route
                key={i}
                path={route.path}
                exact
                component={route.Component}
              />
            )
          )}
          <Route component={_404_} />
        </Switch>
      </div>
    );
  };
};

export default buildRoutes(routes);