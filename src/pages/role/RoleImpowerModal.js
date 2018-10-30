import React from 'react';
import PropTypes from 'prop-types';
import { Card, Tree, message } from 'antd';
import CommonModal from '../../components/CommonModal';
import * as api from '../../api/permission';
import { getErrorMessage } from '../../api/base';
import { convertToTree } from '../../utils/CommonUtils';

const TreeNode = Tree.TreeNode;

class RoleImpowerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeWebData: [],
      checkedWebKeys: [],
      allWebKeys: []
    };
  }

  componentDidMount() {
    api
      .getAllPermissions()
      .then(data => {
        this.setState({
          treeWebData: convertToTree(data)
        });
      })
      .catch(err => {
        message.error(getErrorMessage(err));
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      const { data } = this.props;
      const webKeys = [];
      const allWebKeys = [];
      if (data.id != null) {
        for (let item of data.permissions) {
          allWebKeys.push(item.id);
          // 取出父节点，只保留子节点，因为tree组件会自动将父节点选中
          if (this.isLeaf(item.id, data.permissions)) {
            webKeys.push(String(item.id));
          }
        }
      }
      this.setState({
        checkedWebKeys: webKeys,
        allWebKeys
      });
    }
  }

  isLeaf = (id, permissions) => {
    for (let item of permissions) {
      if (item.parentId === id) {
        return false;
      }
    }
    return true;
  };

  renderTreeNodes = tree => {
    return tree.map(item => {
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

  onWebCheck = (selectedKeys, info) => {
    this.setState({
      checkedWebKeys: selectedKeys
    });
    let keys = [];
    selectedKeys = selectedKeys.concat(info.halfCheckedKeys);
    for (let item of selectedKeys) {
      keys.push(parseInt(item, 10));
    }
    this.setState({
      allWebKeys: keys
    });
  };

  getSelectKeys = () => {
    let permissionIds = this.state.allWebKeys;
    return permissionIds;
  };

  render() {
    return (
      <CommonModal
        {...this.props}
        width="50vw"
        content={() => {
          return (
            <div
              style={{
                display: 'flex'
              }}
            >
              <Card style={{ width: '45vw' }}>
                <Tree
                  showLine
                  multiple
                  checkable
                  defaultExpandAll
                  checkedKeys={this.state.checkedWebKeys}
                  onCheck={this.onWebCheck}
                >
                  {this.renderTreeNodes(this.state.treeWebData)}
                </Tree>
              </Card>
            </div>
          );
        }}
      />
    );
  }
}

RoleImpowerModal.propTypes = {
  data: PropTypes.object
};

RoleImpowerModal.defaultProps = {
  data: {}
};

export default RoleImpowerModal;
