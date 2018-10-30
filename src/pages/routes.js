import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from '../components/split/CommonLoadable';
import Page403 from './common/Page403';
import Page404 from './common/Page404';

const AsyncWelcomePage = Loadable({
  loader: () => import('./welcome/WelcomePage.js')
});
const AsyncUserPage = Loadable({
  loader: () => import('./user/UserPage.js')
});
const AsyncPermissionPage = Loadable({
  loader: () => import('./permission/PermissionPage.js')
});
const AsyncRolePage = Loadable({
  loader: () => import('./role/RolePage.js')
});

const routes = props => {
  const { match } = props;
  return (
    <Switch>
      <Route
        exact
        path={match.url}
        render={() => (
          <Redirect
            to={{
              pathname: '/welcome',
              state: props.location.state
            }}
          />
        )}
      />
      <Route exact path="/welcome" component={AsyncWelcomePage} />
      <Route exact path="/user" component={AsyncUserPage} />
      <Route exact path="/role" component={AsyncRolePage} />
      <Route exact path="/permission" component={AsyncPermissionPage} />
      <Route exact path="/403" component={Page403} />
      <Route component={Page404} />
    </Switch>
  );
};

export default routes;
