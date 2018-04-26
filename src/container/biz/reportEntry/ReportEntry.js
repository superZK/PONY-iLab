import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { reportEntryActions } from '../../../modules';
import { Spin, Button, Input, Row, Col, Modal, message, } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import ReportEntrySetting from './ReportEntryConf';
import AddVerifierDialog from './AddVerifierDialog';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import { analysisDataIndex } from '../../../util/treeUtils';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class ReportEntry extends Component{
  state = { preparedRecords: [] }

  componentDidMount() {
    const {asyncLoadSample} = this.props;
    asyncLoadSample();
  }

  render(){
    const { preparedRecords } = this.state;

    const {
      isLoading,
      editType,
      sampleData,
      currentSample,
      taskData,
      currentTask,
      resultData,
      preparedKey,
    } = this.props;

    const {
      asyncLoadSample,//加载样品数据
      asyncLoadTask,//加载任务数据
      asyncLoadResult,//记载结果项数据
      asyncSaveResult,//保存结果
      preparedItem,//获取结果项表格勾选对象
      asyncSetReportable,//报告项操作
      addVerifier,//打开指定审核人modal
      asyncAddVerifier,//指定审核人
      asyncSubmitReview,//提交审核
      cancelHandle,//取消操作
    } = this.props;

    const sampleTableSetting = ReportEntrySetting.table.sample;//定义样品表格配置
    const taskTableSetting = ReportEntrySetting.table.task;//定义任务表格配置
    const recordTableSetting = ReportEntrySetting.table.record;//定义结果项表格配置
    const resultTableSetting = ReportEntrySetting.table.result;//定义结果项表格配置(用于指定审核人)

    // 获取表格勾选项
    const handleRecordTablePrepare = (rows, rowKeys) => {
      this.setState({
        preparedRecords: rows,
      });
      preparedItem(rowKeys);
    }

    // 根据样品表格点击项获取任务数据
    const handleSampleTableSelect = (record) => {
      asyncLoadTask(record);
    }

    // 根据任务表格点击项获取结果项数据
    const handleTaskTableSelect = (record) => {
      asyncLoadResult(record);
    }

    // 保存结果项
    const handleSaveResult = () => {
      let task = currentTask;
      let editedResult = [];
      resultData.find((item) => {
        if((item.transferOrigin !== item.originalResults) || (item.transferUnit !== analysisDataIndex(item, 'measureUnit.id'))){
          let obj = {};
          obj.id = item.id;
          obj.originalResults = item.originalResults;
          obj.finalResult = item.originalResults;
          obj.measUnitId = analysisDataIndex(item, 'measureUnit.id');
          obj.resultRecordId = analysisDataIndex(item, 'recordStandard.id');
          obj.productTestFlowId = analysisDataIndex(item, 'recordStandard.productTestFlow.id');
          obj.resultId = analysisDataIndex(item, 'recordStandard.resultRecord.id');
          editedResult.push(obj);
        }
      });
      asyncSaveResult(editedResult, task);
    }

    // 报告项操作
    const handleAddReport = () => {
      let task = currentTask;
      let recordIds = preparedRecords.map(item => item.id);
      Modal.confirm({
        title: "设置为报告项",
        content: "注意:未录入的结果项无法变更为报告项",
        onOk(){ asyncSetReportable(recordIds, task) },
        onCancel(){ cancelHandle() },
      });
    }

    const handleDeleteReport = () => {
      let task = currentTask;
      let recordIds = preparedRecords.map(item => item.id);
      Modal.confirm({
        title: "设置为非报告项",
        content: "注意:未录入的结果项无法变更为非报告项",
        onOk(){ asyncSetReportable(recordIds, task) },
        onCancel(){ cancelHandle() },
      });
    }

    // 指定审核人
    const handleAddVerifier = () => {
      addVerifier();
    }

    const confirmAddVerify = (verifierId, selectedRecodIds) => {
      let task = currentTask;
      asyncAddVerifier(verifierId, selectedRecodIds, task);
    }

    // 提交审核
    const handleSubmitReview = () => {
      let notEnteredArr = [];//记录未录入完全的结果项
      let retestArr = [];//记录重测状态的结果项
      let recordIds = preparedRecords.map(item => item.id);

      preparedRecords.map((item) => {
        if(item.id === 0 || !analysisDataIndex(item, 'verifier.verifier.id')){
          notEnteredArr.push(item);
        }else if(analysisDataIndex(item, 'verifier.processStatus.processName') === '重测'){
          retestArr.push(item);
        }
      });

      if(notEnteredArr.length > 0){
        let nameArr = [];
        nameArr = notEnteredArr.map(item => analysisDataIndex(item, 'recordStandard.name'));
        message.warning(`请先为结果项: ${nameArr.join(',')}  指定审核人。`);
        return;
      }else if(retestArr.length > 0){
        let nameArr = [];
        nameArr = retestArr.map(item => analysisDataIndex(item, 'recordStandard.name'));
        message.warning(`重测状态的结果项: ${nameArr.join(',')}  无法提交审核。`);
        return;
      }else{
        Modal.confirm({
          title: "提交审核",
          content: "是否确认将所选结果项提交审核？",
          onOk(){ asyncSubmitReview(currentSample, currentTask, recordIds) },
          onCancel(){ cancelHandle() },
        });
      }
    }

    const handleCancel = () => {
      cancelHandle();
    }

    // 按钮状态控制
    const isMultipleChoice = preparedKey.length >= 1;
    const notAllSame = isAllActiveOrDisable(preparedRecords, 'reportable') === 'notAllSame';
    const allDisable = isAllActiveOrDisable(preparedRecords, 'reportable') === 'allActive';
    const allActive = isAllActiveOrDisable(preparedRecords, 'reportable') === 'allDisable';

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <BaseTable
                    options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                    onSelect={handleSampleTableSelect}
                    hideRowSelection = {true}
                    isExpanded={false}
                    setting={sampleTableSetting}
                    data={sampleData}
                  />
                </div>
              </div>
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <BaseTable
                    options={ {pagination:{pageSize:4, showQuickJumper:true,}} }
                    onSelect={handleTaskTableSelect}
                    isExpanded={false}
                    setting={taskTableSetting}
                    data={taskData}
                  />
                  <SecurityButtonBox>
                    <Button style={{margin: '10px 10px 10px 0' }} key={'lab.testResult.make.save'} type="primary" onClick={handleSaveResult} > 保存 </Button>
                    <Button style={{margin: '10px 10px 10px 0' }} key={'lab.testResult.make.reportable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} onClick={handleAddReport} > 添加为报告项 </Button>
                    <Button style={{margin: '10px 10px 10px 0' }} key={'lab.testResult.make.unreportable'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} onClick={handleDeleteReport} > 从报告项删除 </Button>
                    <Button style={{margin: '10px 10px 10px 0' }} key={'lab.testResult.make.verifier'} onClick={handleAddVerifier} > 指定审核人 </Button>
                    <Button style={{margin: '10px 10px 10px 0' }} key={'lab.testResult.make.submit'} disabled={!(isMultipleChoice && !notAllSame && allActive)} onClick={handleSubmitReview} > 提交审核 </Button>
                  </SecurityButtonBox>
                  <AdvancedTable
                    mode={'Simple'}
                    onPrepare={handleRecordTablePrepare}
                    isExpanded={false}
                    setting={recordTableSetting}
                    data={resultData}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <AddVerifierDialog
            visible = {editType === '添加审核人'}
            editType = {editType}
            onConfirm = {confirmAddVerify}
            onCancel = {handleCancel}
            resultData = {resultData}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

const mapStateToProps = (state) =>
({
  isLoading : state.reportEntryReducer.get('isLoading'),
  editType : state.reportEntryReducer.get('editType'),
  sampleData: state.reportEntryReducer.get('sampleData'),
  currentSample: state.reportEntryReducer.get('currentSample'),
  taskData: state.reportEntryReducer.get('taskData'),
  currentTask: state.reportEntryReducer.get('currentTask'),
  resultData: state.reportEntryReducer.get('resultData'),
  preparedKey: state.reportEntryReducer.get('preparedKey'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
return bindActionCreators(reportEntryActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportEntry);