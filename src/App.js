import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import UserUtils from './utils/UserUtils';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Page404 from './pages/common/Page404';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // 没有登录，则跳转到登陆页面
      if (!UserUtils.isLogin()) {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        );
      }
      // 非admin用户需要判断权限
      if (!UserUtils.isAdmin()) {
        const permissionList = UserUtils.getPermissions();
        permissionList.push(
          { url: '/' },
          { url: '/welcome' },
          { url: '/403' },
          //TODO:测试
          { url: '/permission' }
        );
        let hasPermission = true;
        for (let permission of permissionList) {
          if (props.location.pathname === permission.url) {
            // 已经登陆并且有权限，则正常访问页面
            return <Component {...props} />;
          } else {
            hasPermission = false;
          }
        }
        // 没有权限，则跳转到无权限页面
        if (!hasPermission) {
          return (
            <Redirect
              to={{
                pathname: '/403'
              }}
            />
          );
        }
      }
      return <Component {...props} />;
    }}
  />
);

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <PrivateRoute path="/" component={HomePage} />
      <Route component={Page404} />
    </Switch>
  </BrowserRouter>
);

export default App;
