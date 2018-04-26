import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames/bind';
import { orderDispatchActions } from '../../../modules';
import { Spin, Button, Icon, Row, Col, Badge, Modal } from 'antd';
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import SecurityButtonBox from "../../../component/public/SecurityButtonBox";
import OrderDispatchDialog from "./OrderDispatchDialog";
import OrderEditDialog from "./OrderEditDialog";
import OrderDispatchSetting from './OrderDispatchConf';
import './index.css';

class OrderDispatch extends Component{
  constructor(props){
    super(props);

    this.state = {
      isSampleSearch: true,
    };
  }

  componentWillMount() {
    const {asyncLoadOrderData} = this.props;
    asyncLoadOrderData();
  }

  render(){
    const {
      isSampleSearch,//记录当前使用的搜索区
    } = this.state;

    const {
      isLoading,
      operationType,//操作类型
      orderData,//订单数据
      preparedOrderKey,//订单数据勾选项的Key
      preparedOrderData,//订单数据勾选项
      sampleData,//样品数据
    } = this.props;

    const {
      asyncLoadOrderData,//加载订单数据
      sampleDispatch,//打开样品调度modal
      asyncDispatchSample,//调度样品
      preparedOrder,//勾选订单数据
      asyncSampleBack,//退回样品至未提交状态
      sampleEdit,//编辑样品
      cancel,//取消操作
    } = this.props;

    const OrderQueryTableSetting = OrderDispatchSetting.table.orderQuery;
    const orderQueryFormSetting = OrderDispatchSetting.form.orderQueryForm;

    // 获取表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedOrder(rows, rowKeys);
    }

    // 打开样品调度modal,加载对应的样品数据
    const handleTableButtonDispatch = () => {
      sampleDispatch(preparedOrderData);
    }

    // 打开编辑窗口
    const handleTableButtonEdit = () => {
      sampleEdit();
    }

    // 退回样品
    const handleTableButtonBack = () => {
      Modal.confirm({
        title: "样品退回",
        content: "是否确认退回所选样品？",
        onOk(){ asyncSampleBack(preparedOrderData) },
        onCancel(){ cancel() },
      });
    }

    // 完成样品调度
    const handleDispatchConfirm = (dispatchSample) => {
      if(dispatchSample.length > 0)
        asyncDispatchSample(dispatchSample)
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
                    <Button style={{marginRight: 10}} key={'odr.query.dispatch'} onClick={handleTableButtonDispatch} > 任务调度 </Button>
                    <Button style={{marginRight: 10}} key={'odr.query.edit'} onClick={handleTableButtonEdit} > 编辑 </Button>
                    <Button style={{marginRight: 10}} key={'odr.query.back'} onClick={handleTableButtonBack} > 退回 </Button>
                  </SecurityButtonBox>
                </div>
                <AdvancedTable
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={OrderQueryTableSetting}
                  searchToggle={searchToggle}
                  renderKey={['ordersNo']}
                  data={orderData}
                  colNum={'1'}
                  simpleSearchKey={[['订单编号','ordersNo'], ['客户名称','applicationClient']]}
                  avancedSearchForm={orderQueryFormSetting}
                  operating={[{name: '任务调度', handler: handleTableButtonDispatch}]}
                />
              </div>
            </div>
          </div>
          <OrderDispatchDialog
            operationType = {operationType}
            visible = {operationType === '样品调度'}
            onConfirm = {handleDispatchConfirm}
            onCancel = {handleCancel}
            dataSource = {sampleData}
          />
          <OrderEditDialog
            operationType = {operationType}
            visible = {operationType === '样品编辑'}
            onConfirm = {handleDispatchConfirm}
            onCancel = {handleCancel}
            dataSource = {preparedOrderData}
          />
        </Spin>
      </div>
    );
  }
};

// bind to container

const mapStateToProps = (state) =>
  ({
    isLoading : state.orderDispatchReducer.get('isLoading'),
    operationType: state.orderDispatchReducer.get('operationType'),
    orderData: state.orderDispatchReducer.get('orderData'),
    preparedOrderKey: state.orderDispatchReducer.get('preparedOrderKey'),
    preparedOrderData: state.orderDispatchReducer.get('preparedOrderData'),
    sampleData: state.orderDispatchReducer.get('sampleData'),
  });

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators(orderDispatchActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDispatch);
