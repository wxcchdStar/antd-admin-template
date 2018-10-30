import React from 'react';
import { Button, Icon, Input, message } from 'antd';
import CommonContent from '../../components/CommonContent';
import CommonTable from '../../components/CommonTable';
import CommonDeleteModal from '../../components/CommonDeleteModal';
import { getErrorMessage } from '../../api/base';
import RoleAddModal from './RoleAddModal';
import RoleImpowerModal from './RoleImpowerModal';
import * as api from '../../api/role';
import styles from './Role.module.less';

const Search = Input.Search;

export default class RolePage extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return text === 0 ? '启用' : '禁用';
        }
      },
      {
        title: '描述',
        dataIndex: 'describes',
        key: 'describes'
      }
    ];
    this.state = {
      pageloading: false,
      modalLoading: false,
      addModalVisible: false,
      editModalVisible: false,
      impowerrModalVisible: false,
      searchKeyword: '',
      selectedRowKeys: [],
      selectedRows: []
    };
  }
  requestList = (current, pageSize, { keyword }) => {
    return api.getRoleList({ page: current, size: pageSize, keyword });
  };

  onSearch = (keyword = '') => {
    this.setState({
      searchKeyword: keyword
    });
    this.commonTable.refreshList({
      keyword
    });
    this.clearTableSelect();
  };

  clearTableSelect = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    });
    this.commonTable.clearSelect();
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows
    });
  };

  refreshCurrentPage = () => {
    this.commonTable.refreshCurrentPage({
      keyword: this.state.searchKeyword
    });
  };

  showModal = visible => {
    if (this.state.selectedRows.length > 0) {
      this.setState(visible);
    } else {
      message.warn('请先选择一条数据');
    }
  };

  onAdd = (form, values) => {
    this.setState({
      modalLoading: true
    });
    api
      .addRole(values)
      .then(() => {
        this.setState((prevState, props) => ({
          modalLoading: false,
          addModalVisible: false
        }));
        message.success('操作成功！');
        this.onSearch();
      })
      .catch(err => {
        this.setState((prevState, props) => ({
          modalLoading: false
        }));
        message.error(getErrorMessage(err));
      });
  };

  onEdit = (form, values) => {
    this.setState({
      modalLoading: true
    });
    api
      .editRole(this.state.selectedRowKeys[0], values)
      .then(() => {
        this.setState((prevState, props) => ({
          modalLoading: false,
          editModalVisible: false
        }));
        message.success('操作成功！');
        this.clearTableSelect();
        this.refreshCurrentPage();
      })
      .catch(err => {
        this.setState((prevState, props) => ({
          modalLoading: false
        }));
        message.error(getErrorMessage(err));
      });
  };

  onDelete = (resolve, reject) => {
    api
      .deleteRole(this.state.selectedRows[0].id)
      .then(() => {
        resolve();
        message.success('删除成功！');
        this.onSearch();
      })
      .catch(err => {
        reject();
        message.error(getErrorMessage(err));
      });
  };

  onImpower = () => {
    let permissionIds = [];
    permissionIds = this.RoleImpowerPage.getSelectKeys();
    let id = this.state.selectedRows[0].id;
    this.setState({
      modalLoading: true
    });
    api
      .impowerRole(id, permissionIds)
      .then(() => {
        this.setState((prevState, props) => ({
          modalLoading: false,
          impowerrModalVisible: false
        }));
        message.success('授权成功！');
        this.clearTableSelect();
        this.refreshCurrentPage();
      })
      .catch(err => {
        this.setState((prevState, props) => ({
          modalLoading: false
        }));
        message.error(getErrorMessage(err));
      });
  };

  render() {
    return (
      <CommonContent titles={['角色管理']}>
        <div>
          <div className={styles.btnGroup}>
            <div>
              <Button.Group>
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
                <Button
                  type="primary"
                  onClick={() => this.showModal({ editModalVisible: true })}
                >
                  <Icon type="edit" />编辑
                </Button>
                <CommonDeleteModal
                  data={this.state.selectedRows}
                  onOk={this.onDelete}
                />
              </Button.Group>
              <Button
                style={{ marginLeft: '5px' }}
                type="primary"
                onClick={() => this.showModal({ impowerrModalVisible: true })}
              >
                <Icon type="eye" />角色授权
              </Button>
            </div>
            <Search
              placeholder="请输角色名称查询"
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
        <RoleAddModal
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
        <RoleAddModal
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
        <RoleImpowerModal
          title="角色授权"
          loading={this.state.modalLoading}
          visible={this.state.impowerrModalVisible}
          onCancel={() => {
            this.setState({ impowerrModalVisible: false });
          }}
          onOk={this.onImpower}
          data={this.state.selectedRows[0]}
          ref={ref => (this.RoleImpowerPage = ref)}
        />
      </CommonContent>
    );
  }
}
