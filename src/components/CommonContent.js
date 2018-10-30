import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import styles from './CommonContent.module.less';

export default class CommonContent extends React.Component {
  render() {
    const { titles } = this.props;
    return (
      <div className={styles.content}>
        <Breadcrumb className={styles.contentBreadcrumb}>
          {titles.map(title => {
            return <Breadcrumb.Item key={title}>{title}</Breadcrumb.Item>;
          })}
        </Breadcrumb>
        <div className={styles.contentData}>{this.props.children}</div>
      </div>
    );
  }
}

CommonContent.propTypes = {
  titles: PropTypes.array.isRequired
};

CommonContent.defaultProps = {};
