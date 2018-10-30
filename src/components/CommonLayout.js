import React from 'react';
import propTypes from 'prop-types';
import { Spin } from 'antd';

/**
 * 通用布局
 */
class CommonLayout extends React.Component {
  render() {
    if (this.props.type === 'page') {
      return this.props.loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 'auto',
            height: '100vh'
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        this.props.children
      );
    } else if (this.props.type === 'cover') {
      return <Spin spinning={this.props.loading}>{this.props.children}</Spin>;
    }
    throw new DOMException('Props type must be "page" or "cover".');
  }
}

CommonLayout.propTypes = {
  /** 加载中 */
  loading: propTypes.bool,
  /** 加载形式, page: 内容隐藏，居中展示“加载中”，cover: 在内容之上展示“加载中” */
  type: propTypes.oneOf(['page', 'cover'])
};

CommonLayout.defaultProps = {
  loading: false,
  type: 'page'
};

export default CommonLayout;
