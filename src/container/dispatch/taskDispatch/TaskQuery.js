import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames/bind';
import { taskDispatchActions } from '../../../modules';
import { Spin, Button, Icon, Row, Col, Badge, Modal } from 'antd';
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import BaseInputNumber from "../../../component/public/BaseInputNumber";
import SecurityButtonBox from "../../../component/public/SecurityButtonBox";
import TaskDispatchSetting from './TaskDispatchConf';
import './index.css';

class TaskDispatch extends Component{
  constructor(props){
    super(props);

    this.state = {
      isSampleSearch: true,//记录当前使用的搜索区
      dispatchArr: this.props.taskData || [],//留底数据，参与比较
      fillModalVisible: false, //控制批量填充打开关闭状态
      fillEnd: '', //记录批量填充的结束序号
      value: '', //控制InputNumber的value
      currentNO: '', //当前点击行的序号
    };
  }

  componentWillMount() {
    const {asyncLoadTaskData} = this.props;
    asyncLoadTaskData();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.taskData !== nextProps.taskData){
      let dispatchArr = [];
      nextProps.taskData.map((item) => {
        let obj = {};
        obj.tid = item.id;
        obj.operatorId = item.operator.id ? item.operator.id : '';
        obj.verifierId = item.verifier.verifier ? item.verifier.verifier.id : '';
        dispatchArr.push(obj);
      });
      this.setState({
        dispatchArr,
        currentNO: '',
      });
    }
  }

  render(){
    const {
      isSampleSearch,
      dispatchArr,
      fillModalVisible,
      fillEnd,
      value,
      currentNO,
    } = this.state;

    const {
      isLoading,
      operationType,//操作类型
      taskData,//任务数据
      preparedTaskKey,//任务数据勾选项的key
      preparedTaskData,//任务数据勾选项
    } = this.props;

    const {
      asyncLoadTaskData,//加载任务数据
      preparedTask,//勾选任务数据
      asyncDispatchTask,//保存分发的任务
      cancel,//取消操作
    } = this.props;

    const TaskQueryTableSetting = TaskDispatchSetting.table.taskQuery;
    const taskQueryFormSetting = TaskDispatchSetting.form.taskQueryForm;

    // 获取表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedTask(rows, rowKeys);
    }

    // 打开批量填充modal，进行批量填充
    const handleTableButtonDispatch = () => {
      this.setState({
        fillModalVisible: true,
        fillEnd: '',
      });
    }
    const closeFillModal = () => {
      this.setState({
        fillModalVisible: false,
        value: '',
        currentNO: '',
      });
    }
    // 序号修改
    const onNumberChange = (value) => {
      this.setState({
        value,
      });
    }

    // 批量填充
    const bulkFill = () => {
      const fillEnd = this.state.value;
      this.setState({
        fillEnd,
        fillModalVisible: false,
        value: '',
      });
    }

    // 获取当前点击行的序号
    const onSelect = (record, index) => {
      this.setState({
        currentNO : record.serialNumber,
      });
    }

    // 分发任务
    const handleTableButtonSave = () => {
      let afterFillData = [];//批量填充后的数据
      let modifyData = [];//批量填充后修改的数据
      taskData.map((item) => {
        let obj = {};
        obj.tid = item.id;
        obj.operatorId = item.operator.id ? item.operator.id : '';
        obj.verifierId = item.verifier.verifier ? item.verifier.verifier.id : '';
        afterFillData.push(obj);
      });
      for(let i = 0; i < afterFillData.length; i++){
        let fillDataValues = Object.values(afterFillData[i]);//批量填充后的数据
        let dispatchDataValues = Object.values(this.state.dispatchArr[i]);//留痕数据
        for(let j = 0; j < fillDataValues.length; j++){
          if(fillDataValues[j] !== dispatchDataValues[j]){
            modifyData.push(afterFillData[i]);
            break;
          }
        }
      }
      asyncDispatchTask(modifyData);
    }

    // 记录搜索区的切换，为按钮设置相应的样式
    const searchToggle = (expand) => {
      this.setState({
        isSampleSearch: expand,
      });
    }

    // 为按钮组动态添加样式
    let btnGroup = classNames({
      btnGroup: this.state.isSampleSearch,
    });

    // 取消操作
    const handleCancel = () => {
      cancel();
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{ margin:0}}>
            <div className="panel-body">
              <div style={{ marginBottom: 16 }}>
                <div className={btnGroup}>
                  <SecurityButtonBox>
                    <Button style={{marginRight: 10}} key={'lab.task.dispatch.bulkFill'} onClick={handleTableButtonDispatch} > 批量填充 </Button>
                    <Button style={{marginRight: 10}} key={'lab.task.dispatch.save'} onClick={handleTableButtonSave} > 保存 </Button>
                  </SecurityButtonBox>
                </div>
                <AdvancedTable
                  fillEnd={fillEnd}
                  fillRule={[
                    {changeKey: 'operator.id', judgmentKey: 'processName', judgmentValue: ['已录入']},
                    // {changeKey: 'verifier.verifier.id'},
                  ]}
                  onSelect={onSelect}
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={TaskQueryTableSetting}
                  searchToggle={searchToggle}
                  renderKey={['docProductTestFlow.testItem.name','docProductTestFlow.testStandard.code','docProductTestFlow.testMethod.standardNo',]}
                  data={taskData}
                  colNum={'1'}
                  simpleSearchKey={[['编号','sampleType.orders.orderNo'],['','sampleType.serialNo'],['名称','sampleType.testName'],['','docProductTestFlow.testItem.name'],['标准号','docProductTestFlow.testStandard.code'],['','docProductTestFlow.testMethod.standardNo']]}
                  avancedSearchForm={taskQueryFormSetting}
                />
                <Modal
                  title='批量填充'
                  visible={fillModalVisible}
                  onOk={bulkFill}
                  onCancel={closeFillModal}
                >
                  <span>目标行序号：</span><BaseInputNumber min={this.state.currentNO} max={this.props.taskData.length} value={this.state.value} onChange={onNumberChange} />
                </Modal>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
};

// bind to container

const mapStateToProps = (state) =>
  ({
    isLoading : state.taskDispatchReducer.get('isLoading'),
    operationType: state.taskDispatchReducer.get('operationType'),
    taskData: state.taskDispatchReducer.get('taskData'),
    preparedTaskKey: state.taskDispatchReducer.get('preparedTaskKey'),
    preparedTaskData: state.taskDispatchReducer.get('preparedTaskData'),
  });

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(taskDispatchActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDispatch);
