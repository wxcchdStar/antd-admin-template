import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Spin, message } from 'antd';

/**
 * 通用Modal
 */
class CommonModal extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (
      this.props.visible !== nextProps.visible &&
      !nextProps.visible &&
      this.props.form
    ) {
      this.props.form.resetFields();
    }
  }

  onOk = () => {
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (err) {
        message.warn('请完成信息输入');
        return;
      }
      this.props.onOk(form, values);
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    const textareaLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    };
    let modal;
    if (this.props.hasFooter) {
      const modalProps =
        this.props.footer != null ? { footer: this.props.footer } : {};
      modal = this.props.visible ? (
        <Modal
          visible
          title={this.props.title}
          okText={this.props.okText}
          onOk={this.onOk}
          maskClosable={false}
          confirmLoading={this.props.loading}
          onCancel={this.props.onCancel}
          afterClose={this.props.afterClose}
          width={this.props.width}
          {...modalProps}
        >
          <Spin spinning={this.props.loading}>
            {this.props.content(
              this.props.form,
              formItemLayout,
              textareaLayout
            )}
          </Spin>
        </Modal>
      ) : null;
    } else {
      modal = this.props.visible ? (
        <Modal
          visible
          title={this.props.title}
          afterClose={this.props.afterClose}
          onCancel={this.props.onCancel}
          width={this.props.width}
          footer={null}
        >
          <Spin spinning={this.props.loading}>
            {this.props.content(
              this.props.form,
              formItemLayout,
              textareaLayout
            )}
          </Spin>
        </Modal>
      ) : null;
    }
    return <div>{modal}</div>;
  }
}

CommonModal.propTypes = {
  /** Modal可见性 */
  visible: PropTypes.bool,
  /** 标题 */
  title: PropTypes.string,
  /** ok按钮文字 */
  okText: PropTypes.string,
  /** ok按钮的回调方法 */
  onOk: PropTypes.func,
  /** cancel按钮的回调方法 */
  onCancel: PropTypes.func,
  /** 保存时显示加载状态 */
  loading: PropTypes.bool,
  content: PropTypes.func, // modal内容
  afterClose: PropTypes.func,
  width: PropTypes.string,
  hasFooter: PropTypes.bool,
  footer: PropTypes.array
};

CommonModal.defaultProps = {
  visible: false,
  loading: false,
  title: '添加',
  okText: '确定',
  width: '520px',
  hasFooter: true,
  onOk: () => {},
  onCancel: () => {},
  content: () => {},
  afterClose: () => {}
};

export default Form.create()(CommonModal);
