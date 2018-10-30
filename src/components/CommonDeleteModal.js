import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon, message } from 'antd';

/**
 * 通用删除Modal<br/>
 * 显示删除按钮，点击按钮时展示删除Modal
 */
class CommonDeleteModal extends React.Component {
  showDeleteModal = () => {
    // '确定删除？'
    if (this.props.data.length > 0) {
      Modal.confirm({
        title: this.props.title,
        content: this.props.message,
        okText: '确认',
        cancelText: '取消',
        maskClosable: true,
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.props.onOk(resolve, reject);
          });
        }
      });
    } else {
      message.warn('请先选择一条数据');
    }
  };

  render() {
    return (
      <Button type="primary" onClick={this.showDeleteModal}>
        <Icon type="delete" />
        {this.props.delete}
      </Button>
    );
  }
}

CommonDeleteModal.propTypes = {
  /** 点击确定回调 */
  onOk: PropTypes.func,
  /** 选择的数据项，根据此属性判断按钮在点击时是展示Modal还是给出提示信息 */
  data: PropTypes.array,
  /** 标题 */
  title: PropTypes.string,
  /** 删除按钮文字 */
  delete: PropTypes.string,
  /** 提示信息 */
  message: PropTypes.string
};

CommonDeleteModal.defaultProps = {
  title: '确定删除？',
  delete: '删除',
  onOk: resolve => {
    resolve();
  },
  message: '注：该操作无法恢复'
};

export default CommonDeleteModal;
