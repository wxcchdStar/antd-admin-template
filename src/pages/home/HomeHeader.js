import React from 'react';
import propTypes from 'prop-types';
import { Icon, Layout, Avatar, Dropdown, message, Menu } from 'antd';
import UserInfo from '../../utils/UserUtils';
import ChangePassword from './ChangePassword';
import { logout, modifyPassword } from '../../api/user';
import { getErrorMessage } from '../../api/base';
import './HomeHeader.less';

const { Header } = Layout;

export default class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoading: false,
      modifyPasswordModalVisible: false,
      modifyPasswordLoading: false
    };
  }

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.onLogout();
    } else if (key === 'modifyPassword') {
      this.setState({
        modifyPasswordModalVisible: true
      });
    }
  };

  onModifyPassword = (from, values) => {
    this.setState({
      modifyPasswordLoading: true
    });
    modifyPassword(values.oldPassword, values.newPassword)
      .then(() => {
        this.setState({
          modifyPasswordLoading: false,
          modifyPasswordModalVisible: false
        });
        message.success('密码修改成功，请重新登录！');
        UserInfo.logout();
        this.props.history.push('/login');
      })
      .catch(err => {
        this.setState((prevState, props) => ({
          modifyPasswordLoading: false
        }));
        message.error(getErrorMessage(err));
      });
  };

  onLogout = () => {
    this.setState({
      pageLoading: true
    });
    logout()
      .then(() => {
        UserInfo.logout();
        this.props.history.push('/login');
        this.setState({
          pageLoading: false
        });
      })
      .catch(err => {
        this.setState({
          pageLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  render() {
    const { toggle, collapsed } = this.props;
    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="modifyPassword">修改密码</Menu.Item>
        <Menu.Item key="logout">退出登录</Menu.Item>
      </Menu>
    );
    return (
      <Header className="header">
        <div className="header-content">
          <Icon
            onClick={toggle}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            className="toggle"
          />
          <Dropdown overlay={menu}>
            <div className="avatar-content">
              <Avatar
                style={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  marginRight: '10px'
                }}
              >
                {UserInfo.getUserName() != null
                  ? UserInfo.getUserName()
                      .substring(0, 1)
                      .toUpperCase()
                  : ''}
              </Avatar>
              <div
                style={{
                  color: '#4778c7',
                  fontSize: '20px'
                }}
              >
                <span>{UserInfo.getUserName()}</span>
                <Icon type="down" />
              </div>
            </div>
          </Dropdown>
        </div>
        <ChangePassword
          title="修改密码"
          loading={this.state.modifyPasswordLoading}
          visible={this.state.modifyPasswordModalVisible}
          onCancel={() => {
            this.setState({ modifyPasswordModalVisible: false });
          }}
          onOk={this.onModifyPassword}
        />
      </Header>
    );
  }
}

HomeHeader.propTypes = {
  /* 菜单收缩按钮回调 */
  toggle: propTypes.func,
  /* 菜单是否收缩 */
  collapsed: propTypes.bool
};
