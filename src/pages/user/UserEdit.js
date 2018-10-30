import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Radio, Select, message } from 'antd';
import CommonModal from '../../components/CommonModal';
import { getErrorMessage } from '../../api/base';
import { getRoleList } from '../../api/role';

const FormItem = Form.Item;
const Option = Select.Option;

export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: []
    };
  }
  componentDidMount() {
    getRoleList({ page: 0, size: 999 })
      .then(data => {
        this.setState((prevState, props) => ({
          roleList: data.list
        }));
      })
      .catch(err => {
        message.error(getErrorMessage(err));
      });
  }

  onSelect = value => {
    if (value === 1) {
      this.setState({
        role: 1
      });
    } else {
      this.setState({
        role: value
      });
    }
  };
  render() {
    const { data } = this.props;
    return (
      <CommonModal
        {...this.props}
        width="50vw"
        content={(form, formItemLayout) => {
          const { getFieldDecorator } = form;
          return (
            <Form layout="horizontal">
              <Row gutter={16}>
                <Col span={12}>
                  <FormItem label="用户名" {...formItemLayout}>
                    {getFieldDecorator('username', {
                      initialValue: data.username,
                      rules: [
                        {
                          required: true,
                          message: '用户名不能为空'
                        }
                      ]
                    })(<Input placeholder="请输入用户名" />)}
                  </FormItem>
                </Col>
                {/* 判断添加的时候显示密码，编辑的时候不显示密码 */}
                {data.id == null ? (
                  <Col span={12}>
                    <FormItem label="密码" {...formItemLayout}>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '密码长度6到16位，只能包含数字字母',
                            pattern: '^[^ ]{6,16}$'
                          }
                        ]
                      })(<Input type="password" placeholder="请输入密码" />)}
                    </FormItem>
                  </Col>
                ) : null}
                {/* 判断添加的时候显示密码，编辑的时候不显示密码 */}
                <Col span={12}>
                  <FormItem label="昵称" {...formItemLayout}>
                    {getFieldDecorator('nickname', {
                      initialValue: data.nickname,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '昵称不能为空'
                        }
                      ]
                    })(<Input placeholder="请输入用户昵称" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="角色" {...formItemLayout}>
                    {getFieldDecorator('roleId', {
                      //添加接口字段名
                      initialValue:
                        data.role != null ? data.role.id : undefined, //列表接口字段名
                      rules: [
                        {
                          required: true,
                          message: '角色不能为空'
                        }
                      ]
                    })(
                      <Select
                        placeholder="请选择角色"
                        allowClear
                        showArrow
                        notFoundContent="暂时没有角色"
                        onSelect={this.onSelect}
                      >
                        {this.state.roleList.map(item => {
                          //roleList是一个变量 必须要在构造函数设它的初始值，否则会报错，找不到roleList
                          return (
                            //如果报错找不到map 说明上面把datalist传给rolelist传的不对
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="状态" {...formItemLayout}>
                    {getFieldDecorator('status', {
                      initialValue: data.status,
                      rules: [
                        {
                          required: true,
                          message: '请选择状态'
                        }
                      ]
                    })(
                      <Radio.Group>
                        <Radio value={0}>启用</Radio>
                        <Radio value={1}>禁用</Radio>
                      </Radio.Group>
                    )}
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

UserEdit.propTypes = {
  //属性类型
  data: PropTypes.object
};

UserEdit.defaultProps = {
  data: {}
};
