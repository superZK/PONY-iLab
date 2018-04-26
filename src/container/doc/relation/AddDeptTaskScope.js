import React, {Component} from 'react';
import {Modal, Row, Col, message} from 'antd';
import DeptTaskSetting from './column'

import SearchableTree from "../../../component/public/SearchableTree";
import SearchableTable from "../../../component/public/SearchableTable";

export default class AddDeptTaskScope extends Component{

  componentDidMount() {
    // 列表树 action
    this.props.asyncDeptTaskAddLoad('1003', '产品', this.props.selectedKeys);
  }

  render() {
    const {
      visible,
      onCancel,
      isMatch,//搜索树的匹配规则
      renderTreeNodeTitle,
      selectedKeys,// 首页 树选中项
      deptTaskTree,//新增 列表树
      selectDeptTask,//新增 选中搜索树节点
      dataDeptTask,//新增 右侧列表 data
      deptTaskScopeAddList,//新增 右侧列表
      deptRowKeys,//新增 table选中项
      deptTaskListAddRows,// 新增 右侧列表rows
      deptTaskScopeAdd,// 新增确认 按钮
    } = this.props;

    const addDeptTask = DeptTaskSetting.table.addDeptTask;
    const searchData = DeptTaskSetting.table.formExample;

    const handleSubmitSuccess = () => {
      if (typeof(selectedKeys) === 'number' && deptRowKeys.length > 0){
        deptTaskScopeAdd(selectedKeys, deptRowKeys)
      } else {
        message.warning('请选择产品')
        return false;
      }
    }

    // 搜索树
    const handleSelectTree = (keys) => {
      if(!(isNaN(selectedKeys)) && typeof(selectedKeys) === 'number') {
        deptTaskScopeAddList(selectedKeys, keys)  //右侧列表
      }
    }
    // 右侧列表 data
    const handleTablePrepare = (rows, rowKeys) => {
      deptTaskListAddRows(rows, rowKeys);
    }

    return (
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'检测项目选取'}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
          <Col span={4}>
            <SearchableTree
              maxHeight = {60}
              categoryData = {deptTaskTree}
              expandedKey = {deptTaskTree.length > 0 ? deptTaskTree[0].id + '' : []}
              selectedKeys = {["" + selectDeptTask]}
              onSelect={handleSelectTree}
              isMatch={isMatch}
              renderTitle={renderTreeNodeTitle} />
          </Col>
          <Col span={20}>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-body">
                <SearchableTable
                  options={ {pagination:{pageSize:10, showQuickJumper:true}, scroll:{x: 1400}} }
                  colNum={'1'}
                  simpleSearchKey={['productName', 'testPlanName', 'testItemName', 'testStandardCode','standardNo', 'testStandardName', 'testMethodName']}
                  avancedSearchForm={searchData}
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={addDeptTask}
                  data={dataDeptTask}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    )
  }
}
