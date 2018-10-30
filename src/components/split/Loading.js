import React from 'react';
import { Spin } from 'antd';
import styles from './Loading.module.less';

export default props => {
  if (props.isLoading) {
    if (props.timedOut) {
      return <div className={styles.loading}>加载失败，请刷新页面重试！</div>;
    } else if (props.pastDelay) {
      return (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      );
    } else {
      return null;
    }
  } else if (props.error) {
    return <div className={styles.loading}>加载失败，请刷新页面重试！</div>;
  } else {
    return null;
  }
};
