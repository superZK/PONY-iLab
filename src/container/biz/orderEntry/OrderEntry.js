import React, { Component } from 'react';
import fetchData from '../../../util/fetchGateway';
import {HotKeys} from 'react-hotkeys';
import { Prompt } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { orderEntryActions } from '../../../modules';
import { Spin, Button, Input, Row, Col, Modal, } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import SearchableTree from "../../../component/public/SearchableTree";
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import BaseTable from "../../../component/public/BaseTable";
import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import SampleAddDialog from './SampleAddDialog';
import OrderLoadDialog from './OrderLoadDialog';
import SplitSampleDialog from './SplitSampleDialog';
import CheckSampleDialog from './CheckSampleDialog';
import TaskAddDialog from './TaskAddDialog';
import OrderEntrySetting from './OrderEntryConf';
import { findNodeById } from '../../../util/treeUtils';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const Search = Input.Search;

class OrderEntry extends Component{
  constructor(props) {
    super(props);

    this.state = {
      orderFormData: [],//订单抬头表单数据
      productTestFlow: [],//新增任务时需要选取的检测流程数据
    };
  }
  
  componentDidMount() {
    let userSite = '';
    fetchData('/sys/mode').then(
      (receipt) => {
          userSite = receipt.data[0].siteId ? receipt.data[0].siteId : '';
          if(this.refs.BaseForm)
            this.refs.BaseForm.setFieldsValue({siteId: userSite});
      },
      (error) => {console.log(error)}
    );
  }

  render(){
    const { productTestFlow, orderFormData } = this.state;

    const {
      isLoading,
      editType,
      temporaryStoredTitle,//已暂存的订单抬头
      orderTitles,//模糊查询出的已暂存的订单抬头
      selectedItemKey,//样品树选中节点
      sampleData,//样品树数据
      taskData,//检测任务数据
      preparedTaskKeys,//任务勾选项Key
      testFlow,//检测流程数据
      isSaved,
    } = this.props;

    const {
      addPreOrder,//新增订单
      temporaryDepositOrderTitle,//暂存订单抬头
      queryPreOrder,//模糊查询暂存订单
      addSample,//打开新增样品modal
      asyncAddSample,//新增样品
      asyncLoadOrder,//加载暂存订单
      asyncDeletePreSaveOrder,//删除暂存订单
      selectedSample,//获取选中样品树节点
      splitSample,//打开拆样modal
      asyncSplitSample,//拆样
      asyncDeletePreSaveSample,//删除样品
      asyncDisableSample,//禁用样品
      asyncActiveSample,//启用样品
      checkSampleInfo,//打开查看样品详细信息modal
      queryTestFlowBySampleId,//打开新增任务modal,查询关联的未被使用的检测流程数据
      asyncAddTask,//新增任务
      asyncDeleteTask,//删除检测任务
      preparedTask,//任务表格勾选动作
      asyncDisableTask,//禁用任务
      // asyncActiveTask,//启用任务
      asyncSubmitOrder,//正式提交订单
      cleraDataWhenSwitchRouter,//切换路由时，清空所有数据
      cancelHandle,//取消操作
    } = this.props;

    const OrderTitleFormSetting = OrderEntrySetting.form.orderTitle;//定义抬头表单配置
    const TaskTableSetting = OrderEntrySetting.table.task;//定义检测任务表格配置

    // 可搜索树渲染规则与匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.testName && item.testName.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return `${item.testName}${item.serialNo ? `(${item.serialNo})` : ''}`;
    }

    //暂存订单抬头
    const handleFormSubmitSuccess = () => {
      let obj = {};
      let formValues = this.refs.BaseForm.getFieldsValue();
      let validateStatus = '';
      this.refs.BaseForm.validateFields(['orderNo', 'applicationClient'], (err, v) => {validateStatus = err});//自行添加表单验证
      // 如果没有通过表单校验，直接返回
      if(validateStatus && Object.keys(validateStatus).length){
        return;
      }
      this.setState({
        orderFormData: formValues,
      });
      obj.orderNo = formValues.orderNo;
      obj.applicationClient = formValues.applicationClient;
      obj.applicantCompany = formValues.applicantCompany;
      obj.testCompany = formValues.testCompany;
      obj.salesName = formValues.salesName;
      obj.clientsService = formValues.clientsService;
      obj.amountMoney = formValues.amountMoney;
      let siteId = formValues.siteId;
      if(orderFormData.orderNo !== formValues.orderNo)
        temporaryDepositOrderTitle(obj, siteId);
    }

    // 新增，放弃当前编辑内容，清空表单
    const handleRefresh = () => {
      addPreOrder(this.refs.BaseForm.resetFields);
    }

    // 模糊查询暂存订单
    const handleQuery = (value) => {
      queryPreOrder(value);
    }

    // 加载暂存订单
    const handleLoadOrderSuccess = (orderObj) => {
      asyncLoadOrder(orderObj);
      //将暂存订单抬头回填到表单
      this.refs.BaseForm.setFieldsValue({
          orderNo: orderObj[0].orderNo,
          applicationClient: orderObj[0].applicationClient,
          siteId: orderObj[0].siteId,
          applicantCompany: orderObj[0].applicantCompany,
          testCompany: orderObj[0].testCompany,
          salesName: orderObj[0].salesName,
          clientsService: orderObj[0].clientsService,
          amountMoney: orderObj[0].amountMoney,
      });
      this.setState({
        orderFormData: orderObj[0],
      });
    }

    // 清空暂存订单
    const handleDeletePreSave = () => {
      const refresh = this.refs.BaseForm.resetFields;
      Modal.confirm({
        title: "删除暂存订单",
        content: '是否删除当前暂存的订单信息，清除当前界面内容，进入新订单录入状态？',
        onOk(){
          asyncDeletePreSaveOrder(temporaryStoredTitle, refresh);
        },
        onCancel(){ cancelHandle() },
      });
    }

    // 点击样品树节点
    const onSelect = (selectedKeys) => {
      selectedSample(selectedKeys);
    }

    // 新增样品
    const handleSampleButtonAdd = () => {
      addSample();
    }

    const handleEditFormSubmitSuccess = (values) => {
      let oid = temporaryStoredTitle[0].id;
      let orderNo = temporaryStoredTitle[0].orderNo;
      let productId = values.productId;
      asyncAddSample(values, oid, productId, orderNo);
    }

    // 拆样
    const handleSampleButtonSplit = () => {
      splitSample();
    }

    const handleSplitSampleSuccess = (splitSample, selectedSampleKey) => {
      asyncSplitSample(splitSample, selectedSampleKey);
    }

    // 删除样品
    const handleSampleButtonDelete = () => {
      Modal.confirm({
        title: "删除样品",
        content: '是否删除当前选中的样品？',
        onOk(){
          asyncDeletePreSaveSample(selectedItemKey);
        },
        onCancel(){ cancelHandle() },
      });
    }

    // 样品禁用与启用
    const handleSampleButtonDisable = () => {
      // 每次禁用或启用样品后，需要根据当前暂存订单查询出最新的样品数据
      asyncDisableSample(selectedItemKey, temporaryStoredTitle);
    }

    const handleSampleButtonActive = () => {
      asyncActiveSample(selectedItemKey, temporaryStoredTitle);
    }

    // 查看样品详细信息
    const handleSampleButtonCheck = () => {
      checkSampleInfo();
    }

    // 新增任务
    const handleTaskButtonAdd = () => {
      queryTestFlowBySampleId(selectedItemKey);
    }

    const handleAddTaskSuccess = (obj, selectedSampleKey) => {
      asyncAddTask(obj, selectedSampleKey);
    }

    // 获取检测任务勾选项key
    const handleTablePrepare = (rows, rowKeys) => {
      preparedTask(rows, rowKeys);
    }

    // 删除任务
    const handleTaskButtonDelete = () => {
      Modal.confirm({
        title: "删除任务",
        content: '是否删除当前选中任务？',
        onOk(){ asyncDeleteTask(preparedTaskKeys) },
        onCancel(){ cancelHandle() },
      });
    }

    // 禁用任务
    const handleTaskButtonDisable = () => {
      asyncDisableTask(preparedTaskKeys);
    }

    // 启用任务
    const handleTaskButtonActive = () => {
      asyncDisableTask(preparedTaskKeys);
    }

    // 提交暂存订单
    const handlePreSaveSubmit = () => {
      const refresh = this.refs.BaseForm.resetFields;
      asyncSubmitOrder(temporaryStoredTitle[0].id, refresh);
    }

    // 复制任务
    const handleTaskButtonCopy = () => {
      console.log('复制任务');
    }

    // 取消操作
    const handleAddEditFormCancel = () => {
      cancelHandle();
    }

    // 按钮受控状态相关
    const hasTemporaryStoredTitle = temporaryStoredTitle.length;
    const admitSubmit = temporaryStoredTitle.length && sampleData.length;
    const sampleObj = findNodeById(sampleData, 'id', 'subordinate', selectedItemKey) || {};
    const hasSelectedSample = Object.keys(sampleObj).length > 0;
    const sampleIsDisabled = sampleObj.disable;
    const preparedTasks = getPreparedItems(taskData, preparedTaskKeys);
    const isOnlyRadio = preparedTasks.length === 1;
    const isMultipleChoice = preparedTasks.length >= 1;
    const notAllSame = isAllActiveOrDisable(preparedTasks, 'disable') === 'notAllSame';
    const allDisable = isAllActiveOrDisable(preparedTasks, 'disable') === 'allActive';
    const allActive = isAllActiveOrDisable(preparedTasks, 'disable') === 'allDisable';

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div style={{marginTop:'-20px'}}>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-heading" style={{height:175}}>
                <BaseForm
                  ref = 'BaseForm'
                  colNum = {'1'}
                  setting = {OrderTitleFormSetting}
                  footerRule = {'null'}
                  extraItem = {[
                    <div style={{marginTop: 40}}>
                      <Row>
                        <Col span={16}>
                          <SecurityButtonBox>
                            <Button style={{marginRight: 5}} key={'odr.make.add'} onClick={handleRefresh} > 新增 </Button>
                            <Button style={{marginRight: 5}} key={'odr.make.empty'} disabled={!(hasTemporaryStoredTitle)} onClick={handleDeletePreSave} > 清空 </Button>
                            <Button style={{marginRight: 5}} type = 'primary' size = 'large' key={'odr.make.temporaryDeposit'} onClick={handleFormSubmitSuccess} > 暂 存 </Button>
                            <Button type = 'primary' size = 'large' disabled={!(admitSubmit)} key={'odr.make.submit'} onClick={handlePreSaveSubmit} > 提 交 </Button>
                          </SecurityButtonBox>
                        </Col>
                        <Col span={8}>
                          <Search
                            placeholder="请输入暂存订单号"
                            style={{width: 150 }}
                            onSearch={handleQuery}
                          />
                        </Col>
                      </Row>
                    </div>]}
                />
              </div>
              <div className="panel-body" style={{height: 518}}>
                <div style={{marginTop: 8, paddingLeft: 10, paddingBottom: 12}}>
                  <SecurityButtonBox>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.add'} disabled={!(hasTemporaryStoredTitle)} icon="file-add" onClick={handleSampleButtonAdd} >新增样品</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.split'} icon="database" onClick={handleSampleButtonSplit} disabled={!(hasSelectedSample)} >拆样</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.delete'} icon="delete" onClick={handleSampleButtonDelete} disabled = {!(hasSelectedSample)} >删除样品</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.disable'} icon="close-circle-o" onClick={handleSampleButtonDisable} disabled={!(hasSelectedSample && !sampleIsDisabled)} >禁用样品</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.active'} icon="check-circle-o" onClick={handleSampleButtonActive} disabled={!(hasSelectedSample && sampleIsDisabled)} >启用样品</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.sample.checkout'} icon="search" onClick={handleSampleButtonCheck} disabled = {!(hasSelectedSample)} >查看样品信息</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.task.add'} icon="file-add" onClick={handleTaskButtonAdd} disabled = {!(hasSelectedSample)} >新增任务</Button>
                    {/* <Button style={{marginRight: 10}} key={'odr.make.task.copy'} >复制任务</Button> */}
                    <Button style={{marginRight: 10}} key={'odr.make.task.delete'} icon="delete" disabled={!(isMultipleChoice)} onClick={handleTaskButtonDelete} >删除任务</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.task.disable'} icon="close-circle-o" onClick={handleTaskButtonDisable} disabled={!(isMultipleChoice && !notAllSame && allActive)} >禁用任务</Button>
                    <Button style={{marginRight: 10}} key={'odr.make.task.active'} icon="check-circle-o" onClick={handleTaskButtonActive} disabled={!(isMultipleChoice && !notAllSame && allDisable)} >启用任务</Button>
                  </SecurityButtonBox>
                </div>
                <div>
                  <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
                    <Col span={4}>
                      <SearchableTree
                        maxHeight = {50}
                        categoryData = {sampleData}
                        selectedKeys = {["" + selectedItemKey]}
                        onSelect={onSelect}
                        isMatch={isMatch}
                        renderTitle={renderTreeNodeTitle}
                      />
                    </Col>
                    <Col span={20}>
                      <AdvancedTable
                        mode={'Simple'}
                        options={ {pagination:{pageSize:9, showQuickJumper:true,}} }
                        onPrepare={handleTablePrepare}
                        isExpanded={false}
                        setting={TaskTableSetting}
                        data={taskData}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <Prompt
            // when={!isSaved}
            message={(location) => {
              this.props.cleraDataWhenSwitchRouter();
            }}
          />
          <SampleAddDialog
            visible = {editType === '新增样品'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
          />
          <OrderLoadDialog
            visible = {editType === '加载抬头'}
            onConfirm = {handleLoadOrderSuccess}
            onCancel = {handleAddEditFormCancel}
            dataSource = {orderTitles}
          />
          <SplitSampleDialog
            visible = {editType === '拆样'}
            selectedSample = {selectedItemKey}
            onConfirm = {handleSplitSampleSuccess}
            onCancel = {handleAddEditFormCancel}
          />
          <TaskAddDialog
            visible = {editType === '新增任务'}
            selectedSample = {sampleObj}
            selectedSampleKey = {selectedItemKey}
            productTestFlow = {testFlow}
            onConfirm = {handleAddTaskSuccess}
            onCancel = {handleAddEditFormCancel}
          />
          <CheckSampleDialog
            visible = {editType === '查看样品信息'}
            checkedSample = {sampleObj}
            onFormCancel = {handleAddEditFormCancel}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

const mapStateToProps = (state) =>
  ({
    isLoading : state.orderEntryReducer.get('isLoading'),
    editType: state.orderEntryReducer.get('editType'),
    temporaryStoredTitle: state.orderEntryReducer.get('temporaryStoredTitle'),
    orderTitles: state.orderEntryReducer.get('orderTitles'),
    selectedItemKey: state.orderEntryReducer.get('selectedItemKey'),
    sampleData: state.orderEntryReducer.get('sampleData'),
    taskData: state.orderEntryReducer.get('taskData'),
    preparedTaskKeys: state.orderEntryReducer.get('preparedTaskKeys'),
    testFlow: state.orderEntryReducer.get('testFlow'),
    isSaved: state.orderEntryReducer.get('isSaved'),
  });

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(orderEntryActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderEntry);
