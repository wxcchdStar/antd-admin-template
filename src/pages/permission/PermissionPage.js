import React from 'react';
import { Card, Tree, message, Button, Icon } from 'antd';
import CommonContent from '../../components/CommonContent';
import CommonTable from '../../components/CommonTable';
import CommonDeleteModal from '../../components/CommonDeleteModal';
import PermissionEdit from './PermissionEdit';
import {
  getAllPermissions,
  addPermission,
  editPermission,
  deletePermission
} from '../../api/permission';
import { getErrorMessage } from '../../api/base';
import { convertToTree } from '../../utils/CommonUtils';
import styles from './PermissionPage.module.less';

const TreeNode = Tree.TreeNode;

export default class PermissionPage extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '菜单',
        dataIndex: 'type',
        key: 'type',
        render: text => {
          return text === 1 ? '是' : '否';
        }
      },
      {
        title: '地址',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort'
      }
    ];
    this.state = {
      loading: false,
      modalLoading: false,
      addModalVisible: false,
      editModalVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      // 所有权限，列表
      allPermissionList: [],
      // 权限树，由所有权限列表转化而来
      permissionTree: [],
      currentPermissionId: '0'
    };
  }

  componentDidMount() {
    this.requestGetAllPermissions();
  }

  requestGetAllPermissions() {
    this.setState({
      loading: true
    });
    getAllPermissions()
      .then(data => {
        this.setState(
          {
            loading: false,
            allPermissionList: data,
            permissionTree: [
              {
                id: 0,
                name: '全部',
                children: convertToTree(JSON.parse(JSON.stringify(data)))
              }
            ]
          },
          () => {
            this.commonTable.refreshList({
              permissionId: this.state.currentPermissionId
            });
          }
        );
      })
      .catch(err => {
        this.setState({
          loading: false
        });
        message.error(getErrorMessage(err));
      });
  }

  renderTreeNodes = list => {
    return list.map(item => {
      if (item.children != null && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };

  onMenuPermissionClick = (selectedKeys, { selected }) => {
    if (selected) {
      this.setState({
        currentPermissionId: selectedKeys[0]
      });
      this.commonTable.refreshList({
        permissionId: selectedKeys[0]
      });
    }
  };

  requestList = (page, size, { permissionId = '0' }) => {
    return new Promise(resolve => {
      const permissions = [];
      for (let permission of this.state.allPermissionList) {
        if (permission.parentId + '' === permissionId) {
          permissions.push(permission);
        }
      }
      resolve({
        list: permissions,
        totalCount: permissions.length
      });
    });
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

  onCommonOperation = operation => {
    this.setState({
      modalLoading: true
    });
    operation
      .then(data => {
        this.setState({
          modalLoading: false,
          addModalVisible: false,
          editModalVisible: false
        });
        message.success('操作成功');
        this.requestGetAllPermissions();
      })
      .catch(err => {
        this.setState({
          modalLoading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  onAdd = (form, values) => {
    this.onCommonOperation(addPermission(values));
  };

  onEdit = (form, values) => {
    if (String(values.id) === String(values.parentId)) {
      message.warn('不能选择自己作为父级');
      return;
    }
    this.onCommonOperation(editPermission(values.id, values));
  };

  onDelete = (resolve, reject) => {
    const { selectedRowKeys } = this.state;
    deletePermission(selectedRowKeys[0])
      .then(data => {
        resolve();
        message.success('操作成功');
        this.requestGetAllPermissions();
      })
      .catch(err => {
        reject();
        message.error(getErrorMessage(err));
      });
  };

  render() {
    const { permissionTree, currentPermissionId } = this.state;
    return (
      <CommonContent titles={['权限管理']}>
        <div className={styles.page}>
          <div className={styles.pageLeft}>
            <Card
              title="功能目录"
              hoverable={false}
              loading={this.state.loading}
              bordered={true}
              bodyStyle={{ padding: 0 }}
            >
              <Tree
                onSelect={this.onMenuPermissionClick}
                defaultExpandAll
                // 默认选中全部
                defaultSelectedKeys={[currentPermissionId]}
              >
                {this.renderTreeNodes(permissionTree)}
              </Tree>
            </Card>
          </div>
          <div className={styles.pageRight}>
            <Card
              title="功能信息"
              hoverable={false}
              bordered={true}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding: '16px' }}>
                <div className={styles.buttons}>
                  <Button.Group style={{ marginBottom: '16px' }}>
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
                </div>
                <CommonTable
                  columnkey="id"
                  columns={this.columns}
                  onSelectChange={this.onSelectChange}
                  api={this.requestList}
                  ref={ref => (this.commonTable = ref)}
                  isPagination={false}
                />
              </div>
            </Card>
          </div>
        </div>
        <PermissionEdit
          title="添加"
          loading={this.state.modalLoading}
          visible={this.state.addModalVisible}
          onOk={this.onAdd}
          onCancel={() => {
            this.setState({
              addModalVisible: false
            });
          }}
          permissionTree={this.state.permissionTree}
        />
        <PermissionEdit
          title="编辑"
          loading={this.state.modalLoading}
          visible={this.state.editModalVisible}
          onOk={this.onEdit}
          onCancel={() => {
            this.setState({
              editModalVisible: false
            });
          }}
          permissionTree={this.state.permissionTree}
          data={this.state.selectedRows ? this.state.selectedRows[0] : {}}
        />
      </CommonContent>
    );
  }
}
