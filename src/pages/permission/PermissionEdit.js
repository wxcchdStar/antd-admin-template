import React from 'react';
import { Form, Row, Col, Input, TreeSelect, Radio } from 'antd';
import CommonModal from '../../components/CommonModal';
import { convertToTreeData } from '../../utils/CommonUtils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class PermissionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionTree: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.permissionTree !== nextProps.permissionTree) {
      convertToTreeData(nextProps.permissionTree);
      this.setState({
        permissionTree: nextProps.permissionTree
      });
    }
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data
      });
    }
  }

  render() {
    const { data = {} } = this.props;
    let { permissionTree } = this.props;
    return (
      <CommonModal
        {...this.props}
        width="50vw"
        content={(form, formItemLayout, textareaLayout) => {
          const { getFieldDecorator } = form;
          return (
            <Form layout="horizontal">
              {getFieldDecorator('id', {
                initialValue: data.id
              })(<Input type="hidden" />)}
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem label="父级" {...formItemLayout}>
                    {getFieldDecorator('parentId', {
                      initialValue:
                        data.parentId != null
                          ? String(data.parentId)
                          : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择父级'
                        }
                      ]
                    })(
                      <TreeSelect
                        treeData={permissionTree}
                        dropdownStyle={{ maxHeight: '30vh' }}
                        placeholder="请选择上级"
                        treeDefaultExpandAll
                        dropdownMatchSelectWidth
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="编码" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      initialValue: data.code,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '编码不能为空'
                        }
                      ]
                    })(<Input placeholder="请输入编码" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="名称" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: data.name,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '名称不能为空'
                        }
                      ]
                    })(<Input placeholder="请输入名称" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="菜单" {...formItemLayout}>
                    {getFieldDecorator('isMenu', {
                      initialValue: data.isMenu,
                      rules: [
                        {
                          required: true,
                          message: '请选择是否是菜单'
                        }
                      ]
                    })(
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="地址" {...formItemLayout}>
                    {getFieldDecorator('url', {
                      initialValue: data.url,
                      rules: [
                        {
                          required: data.type === 1,
                          message: '地址不能为空'
                        }
                      ]
                    })(<Input placeholder="请输入地址" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="排序值" {...formItemLayout}>
                    {getFieldDecorator('sort', {
                      initialValue: data.sort
                    })(<Input placeholder="请输入排序值" />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="描述" {...textareaLayout}>
                    {getFieldDecorator('description', {
                      initialValue: data.description,
                      rules: [
                        {
                          required: false,
                          whitespace: true,
                          message: '描述不能为空'
                        }
                      ]
                    })(<TextArea rows={4} placeholder="请输入描述" />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          );
        }}
      />
    );
  }
}
