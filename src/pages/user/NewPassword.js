import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input } from 'antd';

const FormItem = Form.Item;

class NewPassword extends React.Component {
  onCheck = (rule, value, callback) => {
    if (value == null || value === '') {
      callback('旧密码不能为空');
      return;
    }
    if (!value.match(/^[^ ]{6,16}$/)) {
      callback('密码由6到16位不包含空格的字符组成');
      return;
    }
    const verifyNewPassword = this.props.form.getFieldValue(
      'verifyNewPassword'
    );
    if (verifyNewPassword != null && verifyNewPassword !== '') {
      this.props.form.validateFields(['verifyNewPassword'], { force: true });
    }
    callback();
  };

  onAgainNewPassword = (rule, value, callback) => {
    if (value === this.props.form.getFieldValue(this.props.fieldKey)) {
      callback();
    } else {
      callback('两次密码输入不一致');
    }
  };

  render() {
    const { formItemLayout, fieldKey } = this.props;
    const { getFieldDecorator } = this.props.form;
    return [
      <Row key={fieldKey}>
        <Col>
          <FormItem label="新密码" {...formItemLayout}>
            {getFieldDecorator(fieldKey, {
              rules: [
                {
                  required: true,
                  validator: this.onCheck
                }
              ]
            })(
              <Input
                type="password"
                name="newPassword"
                placeholder="请输入新密码"
              />
            )}
          </FormItem>
        </Col>
      </Row>,
      <Row key="verifyNewPassword">
        <Col>
          <FormItem label="确认新密码" {...formItemLayout}>
            {getFieldDecorator('verifyNewPassword', {
              rules: [
                {
                  required: true,
                  validator: this.onAgainNewPassword
                }
              ]
            })(<Input type="password" placeholder="请再次输入新密码" />)}
          </FormItem>
        </Col>
      </Row>
    ];
  }
}

NewPassword.propTypes = {
  form: PropTypes.object.isRequired,
  formItemLayout: PropTypes.object.isRequired,
  fieldKey: PropTypes.string
};

NewPassword.defaultProps = {
  fieldKey: 'newPassword'
};

export default NewPassword;
