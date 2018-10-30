import React from 'react';
import CommonModal from '../../components/CommonModal';
import { Spin, Form, Input, Row, Col, Select } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class RoleAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      roleList: [],
      role: 0
    };
  }

  render() {
    const { data } = this.props;
    return (
      <CommonModal
        {...this.props}
        width="50vw"
        content={(form, textareaLayout, formItemLayout) => {
          const { getFieldDecorator } = this.props.form;
          return (
            <Spin spinning={this.state.loading}>
              <Form layout="horizontal" className="add-user">
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="角色名称" {...textareaLayout}>
                      {getFieldDecorator('name', {
                        initialValue: data.name,
                        rules: [
                          {
                            required: true,
                            message: '角色名称不能为空'
                          }
                        ]
                      })(<Input placeholder="请输入角色名称" />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="角色状态" {...textareaLayout}>
                      {getFieldDecorator('status', {
                        initialValue:
                          data.status != null ? String(data.status) : undefined,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择状态'
                          }
                        ]
                      })(
                        <Select placeholder="请选择状态" allowClear>
                          <Option value="0">启用</Option>
                          <Option value="1">禁用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="描述" {...formItemLayout}>
                      {getFieldDecorator('describes', {
                        initialValue: data.describes,
                        rules: [
                          {
                            whitespace: true
                          }
                        ]
                      })(<TextArea rows={4} placeholder="请输入描述" />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Spin>
          );
        }}
      />
    );
  }
}

RoleAddModal.propTypes = {
  data: PropTypes.object
};

RoleAddModal.defaultProps = {
  data: {}
};

export default Form.create()(RoleAddModal);
