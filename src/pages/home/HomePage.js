import React from 'react';
import { Layout } from 'antd';
import CommonLayout from '../../components/CommonLayout';
import HomeHeader from './HomeHeader';
import HomeMenu from './HomeMenu';
import Routes from '../routes';
import './HomePage.less';

const { Footer, Content } = Layout;

class HomePage extends React.Component {
  state = {
    collapsed: false,
    loading: false,
    menus: []
  };

  onToggleMenu = () => {
    this.setState(preState => {
      return {
        collapsed: !preState.collapsed
      };
    });
  };

  componentDidMount() {}

  render() {
    const { loading, collapsed } = this.state;
    return (
      <CommonLayout loading={loading}>
        <Layout style={{ minHeight: '100vh' }}>
          <HomeMenu collapsed={collapsed} />
          <Layout>
            <HomeHeader
              toggle={this.onToggleMenu}
              collapsed={collapsed}
              {...this.props}
            />
            <Content style={{ height: '100%' }}>
              <Routes {...this.props} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Copyright © 2013 - 2018
            </Footer>
          </Layout>
        </Layout>
      </CommonLayout>
    );
  }
}

export default HomePage;
