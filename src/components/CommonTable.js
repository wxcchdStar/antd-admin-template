import React from 'react';
import propTypes from 'prop-types';
import { Table, message } from 'antd';
import { getErrorMessage } from '../api/base';

export default class CommonTable extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this._otherParams = {};
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      loading: true,
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: total => {
          return `共${total}条`;
        }
      }
    };
  }

  setLoading = loading => {
    this.setState({
      loading
    });
  };

  clearSelect = () => {
    this.onSelectChange([], []);
  };

  refreshCurrentPage = params => {
    const pager = { ...this.state.pagination };
    this.setState({
      pagination: pager
    });
    this.requestList(pager.current, pager.pageSize, params);
  };

  refreshList = params => {
    this._otherParams = params;
    const pager = { ...this.state.pagination };
    pager.current = 1;
    pager.pageSize = 10;
    this.setState({
      pagination: pager
    });
    this.requestList(pager.current, pager.pageSize, params);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    if (this._otherParams == null) {
      this._otherParams = {};
    }
    this._otherParams.sorter = sorter;
    this.requestList(
      pagination.current,
      pagination.pageSize,
      this._otherParams
    );
  };

  requestList = (current, pageSize, params = {}) => {
    this.setState({
      loading: true
    });
    this.props
      .api(current - 1, pageSize, params)
      .then(data => {
        if (!this._isMounted) {
          return;
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = pageSize;
        pagination.total = data.totalCount;
        this.setState({
          loading: false,
          dataSource: data.list,
          pagination
        });
        this.clearSelect();
      })
      .catch(err => {
        this.setState({
          loading: false
        });
        message.error(getErrorMessage(err));
      });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    //Table的onSelectChange
    this.setState({
      selectedRowKeys,
      selectedRows
    });
    this.props.onSelectChange(selectedRowKeys, selectedRows); //rolepage的onSelectChange  因为onSelectChange是对外暴露的属性
  };

  getSelectedRowKeys = () => {
    return this.state.selectedRowKeys;
  };

  getSelectedRows = () => {
    return this.state.selectedRows;
  };

  componentDidMount() {
    this._isMounted = true;
    const pager = { ...this.state.pagination };
    this.requestList(pager.current, pager.pageSize);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: this.props.getCheckboxProps
    };

    return (
      <Table
        defaultExpandAllRows //初始时是否展开所有行
        rowKey={record => {
          return record[this.props.columnkey];
        }}
        loading={loading}
        bordered={true} //是否展示外边框和列边框
        rowSelection={this.props.isSelection ? rowSelection : null} //rowSelection	列表项是否可选择
        onChange={this.handleTableChange}
        pagination={this.props.isPagination ? this.state.pagination : false}
        dataSource={this.state.dataSource} // 指定表格的 数据源为一个数组（数据数组）
        columns={this.props.columns}
        size={this.props.size}
        onRow={this.props.onRow} //设置行属性
        scroll={this.props.scroll}
      />
    );
  }
}

CommonTable.propTypes = {
  columnkey: propTypes.string.isRequired,
  columns: propTypes.array.isRequired,
  api: propTypes.func.isRequired,
  onSelectChange: propTypes.func,
  isPagination: propTypes.bool,
  size: propTypes.string,
  onRow: propTypes.func,
  isSelection: propTypes.bool,
  getCheckboxProps: propTypes.func, //选择框的默认属性配置
  scroll: propTypes.object
};

CommonTable.defaultProps = {
  api: (current, pageSize, { condition, keyword }) => {
    return new Promise(resolve => {
      resolve({ list: [], totalCount: 0 });
    });
  },
  onSelectChange: () => {},
  isPagination: true,
  size: 'default', //正常或迷你类型，default or small
  onRow: () => {},
  isSelection: true
};
