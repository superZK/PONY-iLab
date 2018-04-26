import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as deptTaskScopeAction from '../../../action/document/relation/deptTaskScopeAction';
import * as deptManagementAction from '../../../action/org/dept/deptManagementAction'
import { Spin, Button, Row, Col, Modal, Icon } from 'antd';
import './styles.css';
import fetchData from '../../../util/fetchGateway';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import SearchableTree from "../../../component/public/SearchableTree";
import SearchableSelector from '../../../component/public/SearchableSelector';
import SearchableTable from "../../../component/public/SearchableTable";

import DeptTaskSetting from './column'
import AddDeptTaskScope from './AddDeptTaskScope'


class DeptTaskScope extends Component{
  state = {defaultSite: '', siteName: ''}

  // 获取当前用户组织信息首选项查询用户
  getDefaultSite = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          defaultSite: receipt.data[0].siteId ? receipt.data[0].siteId : '',
          siteName: receipt.data[0].siteName ? receipt.data[0].siteName : '',
        });
        let siteName = receipt.data[0].siteName ? receipt.data[0].siteName : '';
        let siteId = receipt.data[0].siteId ? receipt.data[0].siteId : '';
        const { asyncLoadDept } = this.props.deptManagementAction;
        asyncLoadDept(siteId, siteName);
      },
      (error) => {console.log(error)}
    );
  }

  componentDidMount() {
    this.getDefaultSite();
  }

  render() {
    const {
      isLoading,
      editType,
      selectedKeys,// 左侧列表 树选中项
      deptTaskData,// 右侧列表data
      // rowsDeptTask,// 右侧列表rows
      rowKeysDeptTask,// 右侧列表rowKeys
      deptTaskTree,//新增 列表树
      selectDeptTask,//新增 选中搜索树节点
      dataDeptTask,// 新增 右侧列表data
      // deptRows,// 新增 右侧列表rows
      deptRowKeys,// 新增 右侧列表rowKeys
      // 部门管理
      deptTree,//组织+部门数据树结构
      selectedDeptItem,//可搜索树选中的部门数据
    } = this.props;

    const {
      deptTaskScopeAction: {
        deptTaskScopeList,//右侧列表
        deptTaskListRows,// 右侧列表rows
        deptTaskAdd,// 新增 弹框
        asyncDeptTaskAddLoad,//新增 列表树
        // selectedDeptTask,// 获取可搜索树选中的节点
        deptTaskScopeAddList,// 新增 右侧列表
        deptTaskListAddRows,// 新增 右侧列表rows
        deptTaskScopeAdd,// 新增产品
        deptTaskDelete,// 删除
        cancelDeptTaskScope,//弹框返回
      },
      deptManagementAction: {
        asyncLoadDept,//加载部门数据
        selectedDept,//获取可搜索树选中的节点
      }
    } = this.props

    const DeptTaskScopeSetting = DeptTaskSetting.table.task; // 定义搜索表单
    const searchData = DeptTaskSetting.table.formExample;

    const disAdd = typeof(selectedKeys) === 'number';  // disabled 新增按钮
    const disDelete = rowKeysDeptTask && rowKeysDeptTask.length > 0; // 删除按钮


    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }
    const renderTreeNodeTitle = (item) => {
      return `${item.name}`
    }

    // 下拉菜单 选中select中某一节点时，发送查询部门数据请求
    const handleSelect = (value, option) => {
      asyncLoadDept(option.props.value, option.props.label);
      this.setState({
        defaultSite: value,
        siteName: option.props.label,
      });
    }
    // 下拉菜单
    const handleChange = (value, option) => {
      this.setState({
        defaultSite: value || '',
      });
      if(!value){
        this.setState({
          siteName: '',
        });
      }
    }
    // 搜索树
    const handleSelectTree = (selectedKeys) => {
      const val = selectedKeys && selectedKeys[0] + '';
      if(val.indexOf("site") !== 0) {
        selectedDept(selectedKeys)
        deptTaskScopeList(selectedKeys, 0)  //右侧列表
      }
    }
    // 右侧列表 data
    const handleTablePrepare = (rows, rowKeys) => {
      deptTaskListRows(rows, rowKeys);
    }

    // 删除
    const handleDelete = () => {
      Modal.confirm({
        title: '删除检测项目',
        content: '是否删除当前选中的部门检测项目？',
        onOk() {
          deptTaskDelete(selectedKeys, rowKeysDeptTask)
        },
        onCancel() {cancelDeptTaskScope()}
      })
    }

    // 不带产品导出检测范围
    const loadUrl = '/org/dept/export?dept=' + selectedKeys + '&type=0&flag=2';
    const openPreviewWindow = () => {
      window.open(loadUrl, "_blank");
    }
    
    // 带产品导出检测范围
    const loadUrlP = '/org/dept/export?dept=' + selectedKeys + '&type=0&flag=1';
    const openPreviewWindowP = () => {
      window.open(loadUrlP, "_blank");
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableSelector
                options={{allowClear:true, style:{ width: '100%'} }}
                onSelect={handleSelect}
                onChange={handleChange}
                disabled={false}
                lazyMode={false}
                defaultValue={this.state.defaultSite}
                url='/org/site/select' />
              <SearchableTree
                maxHeight = {70}
                categoryData = {deptTree}
                defaultExpandedKeys={[deptTree.length ? deptTree[0].id + '' : '']}
                selectedKeys = {["" + selectedDeptItem.id]}
                onSelect={handleSelectTree}
                isMatch={isMatch}
                renderTitle={renderTreeNodeTitle} />
            </Col>
            <Col span={20}>
              <div style={{ marginBottom: 10 }}>
                <SecurityButtonBox >
                  <Button.Group>
                    <Button key={'doc.deptScope.management.add'} icon="file-add" disabled={!(disAdd)} onClick={() => deptTaskAdd()} > 新增 </Button>
                    <Button key={'doc.deptScope.management.delete'} icon="delete" disabled={!(disDelete)} onClick={handleDelete} > 删除 </Button>
                    <Button key={'doc.deptScope.management.transfer'} icon="retweet" disabled > 转移 </Button>
                  </Button.Group>
                  <Button.Group>
                    <Button key={'doc.deptScope.management.export'} icon="download" disabled={typeof(selectedKeys)!=='number'} onClick={openPreviewWindow} >导出</Button>
                    <Button key={'doc.deptScope.management.exportP'} icon="download" disabled={typeof(selectedKeys)!=='number'} onClick={openPreviewWindowP}>导出(带产品)</Button>
                  </Button.Group>
                </SecurityButtonBox>

              </div>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <SearchableTable
                    options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                    // onSelect={handleTableSelect}
                    colNum={'1'}
                    // simpleSearchKey={[['产品','productName'],['方案','testPlanName'],['检测项目','testItemName'],['标准号','testStandardCode'],['方法号','standardNo']]}
                    simpleSearchKey={['productName', 'testPlanName', 'testItemName', 'testStandardCode','standardNo']}
                    avancedSearchForm={searchData}
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={DeptTaskScopeSetting}
                    data={deptTaskData}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <AddDeptTaskScope
            visible={editType==='新增'}
            isMatch={isMatch}
            selectedKeys={selectedKeys}//首页 树选中项
            deptTaskTree={deptTaskTree}//新增 列表树
            selectDeptTask={selectDeptTask}//新增 选中搜索树节点
            asyncDeptTaskAddLoad={asyncDeptTaskAddLoad}//新增 列表树
            // selectedDeptTask={selectedDeptTask}// 获取可搜索树选中的节点
            dataDeptTask={dataDeptTask}//新增 右侧列表 data
            deptTaskScopeAddList={deptTaskScopeAddList}// 新增 获取可搜索树选中的节点
            deptRowKeys={deptRowKeys}// 新增 table选中项
            deptTaskScopeAdd={deptTaskScopeAdd}// 新增确认 按钮
            deptTaskListAddRows={deptTaskListAddRows}// 新增 右侧列表rows
            renderTreeNodeTitle={renderTreeNodeTitle}
            onCancel={() => cancelDeptTaskScope()}
          />
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.deptTaskScope.get('isLoading'),
    editType: state.deptTaskScope.get('editType'),
    selectedKeys: state.deptTaskScope.get('selectedKeys'),
    deptTaskData: state.deptTaskScope.get('deptTaskData'),
    // rowsDeptTask: state.deptTaskScope.get('rowsDeptTask'),
    rowKeysDeptTask: state.deptTaskScope.get('rowKeysDeptTask'),
    deptTaskTree: state.deptTaskScope.get('deptTaskTree'),
    selectDeptTask: state.deptTaskScope.get('selectDeptTask'),
    dataDeptTask: state.deptTaskScope.get('dataDeptTask'),
    // deptRows: state.deptTaskScope.get('deptRows'),
    deptRowKeys: state.deptTaskScope.get('deptRowKeys'),
    // 部门管理数据
    deptTree: state.DeptManagement.get('deptTree'),
    selectedDeptItem: state.DeptManagement.get('selectedDeptItem'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    deptTaskScopeAction: bindActionCreators(deptTaskScopeAction, dispatch),
    deptManagementAction: bindActionCreators(deptManagementAction, dispatch),   // 部门管理action
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DeptTaskScope)
