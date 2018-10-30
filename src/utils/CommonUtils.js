import React from 'react';
import { Tree } from 'antd';

export function isDebug() {
  const debug = process.env.REACT_APP_API_DEBUG;
  return debug != null && debug.trim() === 'true';
}

// 将list转化为tree结构
export function convertToTree(list) {
  let map = {};
  let roots = [];
  for (let i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
  }
  for (let i = 0; i < list.length; i += 1) {
    let node = list[i];
    if (node.parentId !== 0) {
      const parentNode = list[map[node.parentId]];
      if (parentNode.children == null) {
        parentNode.children = [];
      }
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// 渲染树节点
export function renderTreeNodes(list) {
  return list.map(item => {
    if (item.children != null && item.children.length > 0) {
      return (
        <Tree.TreeNode title={item.name} key={item.id}>
          {this.renderTreeNodes(item.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode title={item.name} key={item.id} />;
  });
}

// 转化为antd需要的tree数据结构
export function convertToTreeData(
  list,
  key = 'id',
  label = 'name',
  selectable = function(item) {
    return true;
  }
) {
  list.map(item => {
    item.key = item[key];
    item.label = item[label];
    item.value = item[key] + '';
    item.selectable = selectable(item);
    item.title = item[label];
    if (item.children != null) {
      convertToTreeData(item.children, key, label, selectable);
    }
    return null;
  });
}
