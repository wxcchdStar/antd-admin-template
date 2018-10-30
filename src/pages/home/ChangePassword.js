import React from 'react';
import { Form, Spin, Row, Col, Input } from 'antd';
import CommonModal from '../../components/CommonModal';
import NewPassword from '../user/NewPassword';

const FormItem = Form.Item;

class ChangePassword extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonModal
        {...this.props}
        content={(form, formItemLayout) => {
          formItemLayout = {
            labelCol: {
              span: 5
            },
            wrapperCol: {
              span: 19
            }
          };
          return (
            <Spin spinning={this.props.loading}>
              <Form layout="horizontal">
                <Row>
                  <Col>
                    <FormItem label="旧密码" {...formItemLayout}>
                      {getFieldDecorator('oldPassword', {
                        rules: [
                          {
                            required: true,
                            message: '请输入旧密码'
                          }
                        ]
                      })(<Input type="password" placeholder="请输入旧密码" />)}
                    </FormItem>
                  </Col>
                </Row>
                <NewPassword form={form} formItemLayout={formItemLayout} />
              </Form>
            </Spin>
          );
        }}
      />
    );
  }
}

export default Form.create()(ChangePassword);
