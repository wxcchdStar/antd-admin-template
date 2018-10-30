import React from 'react';
import { Form, Spin } from 'antd';
import CommonModal from '../../components/CommonModal';
import NewPassword from './NewPassword';

class ResetPassword extends React.Component {
  render() {
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
                <NewPassword
                  form={form}
                  formItemLayout={formItemLayout}
                  fieldKey="password"
                />
              </Form>
            </Spin>
          );
        }}
      />
    );
  }
}

export default Form.create()(ResetPassword);
