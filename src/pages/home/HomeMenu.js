import React from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { isDebug } from '../../utils/CommonUtils';
import UserUtils from '../../utils/UserUtils';
import './HomeMenu.less';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class HomeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: ''
    };
  }

  handleClickMenu = ({ item, key, keyPath }) => {
    this.setState({
      currentMenu: key
    });
  };

  render() {
    const { collapsed } = this.props;
    return (
      <Sider
        collapsed={collapsed}
        width={256}
        className="slider"
        style={{ minHeight: '100vh' }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[this.state.currentMenu]}
          onClick={this.handleClickMenu}
        >
          <Menu.Item key="logo">
            {/* {collapsed ? (
              <div className="logo">
                <img src={null} alt="logo" style={{ height: '40px' }} />
              </div>
            ) : (
              <div>
                <img src={null} alt="logo" style={{ height: '40px' }} />
              </div>
            )} */}
          </Menu.Item>
          {UserUtils.getPermission('organization') ? (
            <SubMenu
              key="organization"
              title={
                <span>
                  <i className="fas fa-users anticon" />
                  <span>机构管理</span>
                </span>
              }
            >
              {UserUtils.getPermission('user') ? (
                <Menu.Item key="user">
                  <Link
                    to={{
                      pathname: '/user'
                    }}
                  >
                    <i className="fas fa-user anticon" />
                    <span>用户管理</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {UserUtils.getPermission('role') ? (
                <Menu.Item key="role">
                  <Link
                    to={{
                      pathname: '/role'
                    }}
                  >
                    <i className="fas fa-user-lock anticon" />
                    <span>角色管理</span>
                  </Link>
                </Menu.Item>
              ) : null}
              {/* 为开发方便，增加权限管理，线上环境隐藏掉 */}
              {isDebug() ? (
                <Menu.Item key="permission">
                  <Link
                    to={{
                      pathname: '/permission'
                    }}
                  >
                    <i className="fas fa-lock anticon" />
                    <span>权限管理</span>
                  </Link>
                </Menu.Item>
              ) : null}
            </SubMenu>
          ) : null}
        </Menu>
      </Sider>
    );
  }
}
