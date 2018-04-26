import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { dataVerifyActions } from '../../../modules';
import { Spin, Button, Input, Row, Col, Modal, } from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import AlertTablePlusForVerify from "../../../component/public/AlertTablePlus2.0";
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import SearchableTree from "../../../component/public/SearchableTree";
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import DataVerifySetting from './DataVerifyConf';
import ResultVerifyDialog from './ResultVerifyDialog';
import SampleVerifyDialog from './SampleVerifyDialog';
import SubSampleVerifyDialog from './SubSampleVerifyDialog';
import TaskVerifyDialog from './TaskVerifyDialog';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import {uniqueObj} from '../../../util/treeUtils.js';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class DataVerify extends Component{
  state = {
    verifySample: [],
    needVerifyResult: [],//用来记录选取的所有待审核结果项，用来实现跨任务等类似场景操作
  };

  componentDidMount() {
    const {asyncLoadOrder} = this.props;
    asyncLoadOrder();
  }

  render(){
    const {
      verifySample,
      needVerifyResult,
    } = this.state;

    const {
      isLoading,
      editType,
      orderData,
      sampleTaskData,
      resultData,
      selectOrder,
      selectSampleTask,
    } = this.props;

    const {
      asyncLoadOrder,//加载订单数据
      asyncLoadSampleTask,//根据订单号查询样品与检测项目
      asyncLoadResult,//根据任务查询结果项
      resultVerify,//打开结果审核窗口
      asyncVerifyResult,//结果审核
      taskVerify,//打开任务审核窗口
      asyncVerifyTask,//任务审核
      subSampleVerify,//打开分样审核窗口
      asyncVerifySubSample,//分样审核
      sampleVerify,//打开样品审核窗口
      asyncVerifySample,//样品审核
      cancelHandle,//取消操作
    } = this.props;

    const ordersTableSetting = DataVerifySetting.table.orders;
    const sampleTableSetting = DataVerifySetting.table.sample;
    const resultTableSetting = DataVerifySetting.table.result;

    // 点击订单查询样品
    const handleOrderTableSelect = (record) => {
      asyncLoadSampleTask(record);
    }

    // 点击样品任务表查询结果项
    const handleSampleTaskTableSelect = (record) => {
      asyncLoadResult(record);
    }

    // 勾选样品数据
    const handlePreparedSample = (row,  rowKey) => {
      this.setState({
        verifySample: row,
      });
    }

    // 勾选结果数据
    const handlePreparedResult = (row,  rowKey) => {
      const allInfoResult = row.map((item) => {
        let copy = Object.assign({}, selectSampleTask);//复制选中的样品与任务数据并与每一条结果项拼接在一起显示在审核modal中
        copy.name = item.resultName || '';
        copy.resultId = item.id || '';
        copy.key = item.key || '';//使用结果项的key做新数据的key
        copy.measUnitName = item.measUnitName || '';
        copy.verifiers = item.verifiers || '';
        copy.processName = item.processName || '';
        copy.originalResults = item.originalResults || '';
        copy.finalResult = item.finalResult || '';
        copy.max = item.max || '';
        copy.min = item.min || '';
        return copy;
      });
      this.setState({
        needVerifyResult: allInfoResult,
      });
    }

    // 结果审核
    const handleResultVerify = () => {
      resultVerify();
    }

    const ConfirmVerifyResult = (verifyResult) => {
      asyncVerifyResult(verifyResult, selectOrder, selectSampleTask);
    }

    // 任务审核
    const handleTaskVerify = () => {
      taskVerify();
    }

    const ConfirmVerifyTask = (verifyTask) => {
      asyncVerifyTask(verifyTask, selectOrder, selectSampleTask);
    }

    // 分样审核
    const handleSubSampleVerify = () => {
      subSampleVerify();
    }

    const ConfirmVerifySubSample = (verifySubSample) => {
      asyncVerifySubSample(verifySubSample, selectOrder, selectSampleTask);
    }

    // 样品审核
    const handleSampleVerify = () => {
      sampleVerify();
    }

    const confirmVerifySample = (verifySample) => {
      asyncVerifySample(verifySample, selectOrder, selectSampleTask);
    }

    // 取消
    const handleCancel = () => {
      cancelHandle();
    }

    return(
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <BaseTable
                    options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
                    onSelect={handleOrderTableSelect}
                    hideRowSelection={true}
                    isExpanded={false}
                    setting={ordersTableSetting}
                    data={orderData}
                  />
                </div>
              </div>
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <div>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'lab.testResult.approve.verify.result'} onClick={handleResultVerify} > 审核结果 </Button>
                        <Button key={'lab.testResult.approve.verify.testItem'} onClick={handleTaskVerify} > 审核检测项目 </Button>
                        <Button key={'lab.testResult.approve.verify.subSample'} onClick={handleSubSampleVerify} > 审核分样 </Button>
                        <Button key={'lab.testResult.approve.verify.sample'} onClick={handleSampleVerify} > 审核样品 </Button>
                      </Button.Group>
                      <Button.Group style={{marginLeft: 10}}>
                        <Button key={'lab.testResult.approve.checkout.method'} > 查看方法标准 </Button>
                        <Button key={'lab.testResult.approve.checkout.limit'} > 查看限值标准 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                    <AlertTablePlusForVerify
                      options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                      onPrepare={handlePreparedSample}
                      onSelect={handleSampleTaskTableSelect}
                      isExpanded={false}
                      renderKey={['testItemName', 'testName']}
                      setting={sampleTableSetting}
                      data={sampleTaskData}
                    />
                    <AlertTablePlusForVerify
                      options={ {pagination:{pageSize:4, showQuickJumper:true,}} }
                      onPrepare={handlePreparedResult}
                      setting={resultTableSetting}
                      renderKey={['resultName', 'testItemName', 'testName']}
                      data={resultData}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <SampleVerifyDialog
            visible = {editType === '样品审核'}
            editType = {editType}
            onConfirm = {confirmVerifySample}
            onCancel = {handleCancel}
            dataSource = {this.state.verifySample}
          />
          <SubSampleVerifyDialog
            visible = {editType === '分样审核'}
            editType = {editType}
            onConfirm = {ConfirmVerifySubSample}
            onCancel = {handleCancel}
            dataSource = {this.state.verifySample}
          />
          <TaskVerifyDialog
            visible = {editType === '检测项目审核'}
            editType = {editType}
            onConfirm = {ConfirmVerifyTask}
            onCancel = {handleCancel}
            dataSource = {this.state.verifySample}
          />
          <ResultVerifyDialog
            visible = {editType === '结果审核'}
            editType = {editType}
            onConfirm = {ConfirmVerifyResult}
            onCancel = {handleCancel}
            dataSource = {needVerifyResult}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

const mapStateToProps = (state) =>
({
  isLoading : state.dataVerifyReducer.get('isLoading'),
  editType : state.dataVerifyReducer.get('editType'),
  orderData : state.dataVerifyReducer.get('orderData'),
  sampleTaskData : state.dataVerifyReducer.get('sampleTaskData'),
  resultData : state.dataVerifyReducer.get('resultData'),
  selectOrder : state.dataVerifyReducer.get('selectOrder'),
  selectSampleTask : state.dataVerifyReducer.get('selectSampleTask'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
return bindActionCreators(dataVerifyActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DataVerify);