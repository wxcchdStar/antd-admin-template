import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import UserUtils from '../../utils/UserUtils';
import { Link } from 'react-router-dom';
import VerifyCode from './VerifyCode';
import { login } from '../../api/user';
import { getErrorMessage } from '../../api/base';
import './LoginPage.less';

const FormItem = Form.Item;

class LoginPage extends React.Component {
  state = {
    loading: false
  };

  onLogin = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 校验验证码
        const code = values.verifycode;
        if (
          code != null &&
          code.toLowerCase() !== this.verifyCode.code.toLowerCase()
        ) {
          message.error('验证码错误');
          this.verifyCode.updateCode();
          return;
        }
        // 登录
        if (!this.state.loading) {
          this.setState({
            loading: true
          });
          login(values.username, values.password)
            .then(data => {
              UserUtils.save(data);
              const { from } = this.props.location.state || {
                from: { pathname: '/' }
              };
              this.props.history.push(from, {
                isFormLogin: true
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                loading: false
              });
              message.error(getErrorMessage(err));
            });
        }
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-page">
        <p className="login-title">后台管理系统</p>
        <Form onSubmit={this.onLogin} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名' }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="密码"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('verifyCode', {
              rules: [{ required: true, message: '请输入验证码' }]
            })(
              <div
                className="verifyCode"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Input
                  style={{ width: '200px' }}
                  prefix={
                    <Icon type="safety" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="验证码"
                />
                <div className="pinImg">
                  <VerifyCode
                    width={100}
                    height={30}
                    ref={ref => (this.verifyCode = ref)}
                    onClick={() => {
                      this.verifyCode.updateCode();
                    }}
                  />
                </div>
              </div>
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              登录
            </Button>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true
            })(
              <div className="handle-password">
                <Link
                  to={{
                    pathname: '/forgetpassword'
                  }}
                >
                  <span className="forget-password">忘记密码？</span>
                </Link>
              </div>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
