import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { reportVerifyActions } from '../../../modules';
import { Spin, Button, Row, Col, Icon } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import ReportVerifyDialog from './ReportVerifyDialog';
import ReportVerifySetting from './column';
// import SampleTable from './SampleTable';
import ApproveLogDialog from "../../../component/public/wf/ApproveLogDialog";
import { isInArray } from '../../../util/treeUtils';
import './styles.css';

class ReportVerify extends Component{

  componentDidMount() {
    const {reportVList} = this.props.reportVerifyActions
    reportVList()
  }

  render(){
    const {
      isLoading,
      editType,
      searchData,           // 左侧搜索列表 data
      // rowsList,             // 搜索树rows
      // rowKeysList,          // 搜索树rowKeys
      // reportVerifyKey,      // 订单 点击项 选中的key值
      rowsTableList,        // 右侧列表 rows
      rowKeystableKeysList, // 右侧列表rowkeys
      listVerifyClick,      // 右侧列表 点击项
      reportVerifyData,     // 右侧列表 data
    } = this.props;

    const {
      // listTreeRows,         // 左侧列表 rows
      listTreeClick,        // 左侧列表 点击项
      listTableRows,        // 右侧列表 rows
      listTableClick,       // 右侧列表 点击项
      reportVTableList,     // 右侧列表 action
      cancelHandle,         // 取消操作
      reportVerifyBut,      // 报告审核 弹框
      reportVBtn,           // 报告审核 确认
      reportVerifyRecord,   // 审核记录 弹框
    } = this.props.reportVerifyActions

    const ordersTableSetting = ReportVerifySetting.table.orders;
    const ordersListSetting = ReportVerifySetting.table.ordersList;

    // dis 审核报告
    const disTable = (rowKeystableKeysList && rowKeystableKeysList.length) > 0 || isInArray(Object.keys(listVerifyClick), 'id');

    // disabled 报告内容
    const isReportT = isInArray(Object.keys(listVerifyClick), 'id') || (rowKeystableKeysList.length === 1);
    const reportKey = (rowKeystableKeysList && Number.parseInt(rowKeystableKeysList[0], 10)) || listVerifyClick.id;
    const handleContentUrl = '/report/reportcompile/preview/pdf?reportCompileId=' + reportKey;
    const openPreviewWindow = () => {
      window.open(handleContentUrl, "_blank");
    }

    // disabled 审批记录
    const singlePrepared = (rowsTableList && rowsTableList.length === 1) || isInArray(Object.keys(listVerifyClick), 'id'); // dis审批记录
    const dataList = (rowsTableList && rowsTableList.length === 1) ? (rowsTableList[0].process && rowsTableList[0].process.id) : null;
    const processId = singlePrepared ? (dataList || listVerifyClick.id) : 0;

    // 左侧订单 rows rowKeys/表格点击项
    // const handlePrepare = (rows, rowKeys) => {
    //   listTreeRows(rows, rowKeys);
    // }
    const handleVerifyTableSelect = (click) => {
      listTreeClick(click);
      reportVTableList(click)
    }

    // 右侧rows rowKeys
    const handlePrepareTable = (rows, rowKeys) => {
      listTableRows(rows, rowKeys);
    }

    // 平铺左侧列表 数据
    const flattenOrderSample = (data) => {
      if(!data) return;
      let arr = [];
      (data || []).map(v => {
        let obj = {};
        obj.orderNo = v.orderNo || '';
        obj.name = v.name || '';
        obj.orderId = v.id || '';
        obj.sampleArr = [];
        if(v.sampleType && v.sampleType.length > 0) {
          (v.sampleType || []).map(item => {
            let sampleObj = {};
            sampleObj.sampleId = item.id || '';
            sampleObj.testName = item.testName || '';
            sampleObj.serialNo = item.serialNo || '';
            obj.sampleArr.push(sampleObj)
          })
        }
        arr.push(obj);
      })
      let array = [];
      arr.map(v => {
        let obj = {};
        obj.orderNo = v.orderNo || '';
        obj.name = v.name || '';
        obj.orderId = v.orderId || '';
        if(v.sampleArr.length > 0) {
          v.sampleArr.map(item => {
            let assignObj = Object.assign({}, obj);
            assignObj.sampleId = item.sampleId || '';
            assignObj.testName = item.testName || '';
            assignObj.serialNo = item.serialNo || '';
            array.push(assignObj)
          })
        } else {
          obj.sampleId = '';
          obj.testName = '';
          obj.serialNo = '';
          array.push(obj);
        }
      })
      for(let i=0; i<array.length; i++) array[i].key=(i+1)+'';
      return array;
    }

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  {/* <BaseTable
                    options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                    onSelect={handleVerifyTableSelect}
                    onPrepare={handlePrepare}
                    hideRowSelection={true}
                    isExpanded={false}
                    setting={ordersTableSetting}
                    data={flattenOrderSample(searchData || [])}
                  /> */}
                  <AdvancedTable
                    mode={'Search'}
                    hideRowSelection={true}
                    pagination={{pageSize:10, showQuickJumper:true}}
                    onSelect={handleVerifyTableSelect}
                    onPrepare={false}
                    isExpanded={false}
                    setting={ordersTableSetting}
                    data={flattenOrderSample(searchData || [])}
                    colNum={'1'}
                    simpleSearchKey={[['订单编号','orderNo'],['', 'name'],['样品编号','serialNo']]}
                    avancedSearchForm={false}
                    disabledA={true}
                  />
                </div>
              </div>
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <div style={{marginBottom: 15}}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'rpt.approve.content'} icon="eye-o" disabled={!(isReportT)} onClick={openPreviewWindow}>报告内容</Button>
                        <Button key={'rpt.approve.approval'} icon="bars" disabled={!(singlePrepared)} onClick={reportVerifyRecord} > 审批记录 </Button>
                        <Button key={'rpt.approve.verify'} icon="folder" disabled={!(disTable)} onClick={() => reportVerifyBut()} > 审核报告 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                    {/* <SampleTable
                      onPrepare={handlePrepareTable}
                      reportVerifyData={reportVerifyData}
                     /> */}
                   <BaseTable
                     options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                     onPrepare={handlePrepareTable}
                     onSelect={listTableClick}
                     // hideRowSelection={true}
                     isExpanded={false}
                     setting={ordersListSetting}
                     data={reportVerifyData}
                   />
                </div>
              </div>
            </Col>
          </Row>
          <ReportVerifyDialog
            visible = {editType === '报告审核'}
            editType = {editType}
            onConfirm = {reportVBtn}
            onCancel = {() => cancelHandle()}
            dataSource = {(rowsTableList && rowsTableList.length > 0) ? rowsTableList : [listVerifyClick]}
          />
          {/* 审批记录 */}
          <ApproveLogDialog
            visible={editType === 'approveLog'}
            onCancel={cancelHandle}
            processId={processId} />
        </Spin>
      </div>
    );
  }
};

// bind to container

function mapStateToProps(state) {
  return {
    isLoading : state.reportVerifyReducer.get('isLoading'),
    editType : state.reportVerifyReducer.get('editType'),
    searchData: state.reportVerifyReducer.get('searchData'),
    // rowsList: state.reportVerifyReducer.get('rowsList'),
    // rowKeysList: state.reportVerifyReducer.get('rowKeysList'),
    rowsTableList: state.reportVerifyReducer.get('rowsTableList'),
    rowKeystableKeysList: state.reportVerifyReducer.get('rowKeystableKeysList'),
    // reportVerifyKey: state.reportVerifyReducer.get('reportVerifyKey'),
    listVerifyClick: state.reportVerifyReducer.get('listVerifyClick'),
    reportVerifyData : state.reportVerifyReducer.get('reportVerifyData'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    reportVerifyActions: bindActionCreators(reportVerifyActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportVerify);
