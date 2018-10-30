import React from 'react';
import { Button, Icon, Input, message } from 'antd';
import CommonContent from '../../components/CommonContent';
import CommonTable from '../../components/CommonTable';
import CommonDeleteModal from '../../components/CommonDeleteModal';
import UserAdd from './UserEdit';
import UserEdit from './UserEdit';
import ResetPassword from './ResetPassword';
import { getErrorMessage } from '../../api/base';
import {
  getUserList,
  addUser,
  editUser,
  deleteUser,
  resetPassword
} from '../../api/user';
import styles from './UserPage.module.less';

const Search = Input.Search;

export default class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname'
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        render: text => {
          if (text != null) {
            return text.name;
          }
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return text === 0 ? '启用' : '禁用';
        }
      }
    ];
    this.state = {
      pageloading: false,
      modalLoading: false,
      addModalVisible: false,
      editModalVisible: false,
      resetPasswordModalVisible: false,
      searchKeyword: '',
      selectedRowKeys: [],
      selectedRows: []
    };
  }

  requestList = (current, pageSize, { keyword }) => {
    return getUserList({ page: current, size: pageSize, keyword });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  showEditModal = () => {
    if (this.state.selectedRows.length > 0) {
      this.setState({
        editModalVisible: true
      });
    } else {
      message.warn('请先选择一条数据');
    }
  };

  resetPasswordModal = () => {
    if (this.state.selectedRows.length > 0) {
      this.setState({
        resetPasswordModalVisible: true
      });
    } else {
      message.warn('请先选择一条数据');
    }
  };

  onRefresh = () => {
    this.commonTable.refreshList({
      userId: this.state.currentUserId
    });
  };

  onSearch = (keyword = '') => {
    this.setState({
      searchKeyword: keyword
    });
    this.commonTable.refreshList({
      keyword
    });
  };

  clearTableSelect = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    });
    this.commonTable.clearSelect();
  };

  onAdd = (form, values) => {
    this.setState({
      modalLoading: true
    });
    addUser(values)
      .then(() => {
        this.setState({
          addModalVisible: false,
          modalLoading: false
        });
        message.success('操作成功！');
        this.onRefresh();
      })
      .catch(err => {
        this.setState({
          modalLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  onEdit = (form, values) => {
    this.setState({
      modalLoading: true
    });
    editUser(this.state.selectedRowKeys[0], values)
      .then(() => {
        this.setState({
          modalLoading: false,
          editModalVisible: false
        });
        message.success('操作成功！');
        this.clearTableSelect();
        this.onRefresh();
      })
      .catch(err => {
        this.setState({
          modalLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  onDelete = (resolve, reject) => {
    this.setState({
      modalLoading: true
    });
    const { selectedRowKeys } = this.state;
    deleteUser(selectedRowKeys[0])
      .then(data => {
        resolve();
        message.success('操作成功');
        this.onRefresh();
      })
      .catch(err => {
        this.setState({
          modalLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  onReset = (form, values) => {
    this.setState({
      modalLoading: true
    });
    resetPassword(this.state.selectedRowKeys[0], values)
      .then(() => {
        this.setState({
          resetPasswordModalVisible: false
        });
        message.success('操作成功！');
        this.clearTableSelect();
      })
      .catch(err => {
        this.setState({
          modalLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  render() {
    return (
      <CommonContent titles={['用户管理']}>
        <div>
          <div className={styles.btnGroup}>
            <div>
              <Button.Group style={{ marginRight: '10px' }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      addModalVisible: true
                    });
                  }}
                >
                  <Icon type="plus" />添加
                </Button>
                <Button type="primary" onClick={this.showEditModal}>
                  <Icon type="edit" />编辑
                </Button>
                <CommonDeleteModal
                  data={this.state.selectedRows}
                  onOk={this.onDelete}
                />
              </Button.Group>
              <Button.Group>
                <Button type="primary" onClick={this.resetPasswordModal}>
                  <Icon type="lock" />重置密码
                </Button>
              </Button.Group>
            </div>
            <Search
              placeholder="请输入关键词查询"
              enterButton="查询"
              style={{ width: '250px' }}
              onSearch={this.onSearch}
            />
          </div>
          <CommonTable
            columnkey="id"
            columns={this.columns}
            onSelectChange={this.onSelectChange}
            api={this.requestList}
            ref={ref => (this.commonTable = ref)}
          />
        </div>
        <UserAdd
          title="添加"
          loading={this.state.modalLoading}
          visible={this.state.addModalVisible}
          onOk={this.onAdd}
          onCancel={() => {
            this.setState({
              addModalVisible: false
            });
          }}
        />
        <UserEdit
          title="编辑"
          loading={this.state.modalLoading}
          visible={this.state.editModalVisible}
          onOk={this.onEdit}
          onCancel={() => {
            this.setState({
              editModalVisible: false
            });
          }}
          data={this.state.selectedRows ? this.state.selectedRows[0] : {}}
        />
        <ResetPassword
          title="重置密码"
          loading={this.state.modalLoading}
          visible={this.state.resetPasswordModalVisible}
          onOk={this.onReset}
          onCancel={() => {
            this.setState({
              resetPasswordModalVisible: false
            });
          }}
        />
      </CommonContent>
    );
  }
}
