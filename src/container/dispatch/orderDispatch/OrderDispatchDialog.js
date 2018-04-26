import React, {Component} from 'react';
import { Modal, Button, InputNumber } from 'antd';
import AdvancedTable from "../../../component/public/AdvancedTable";
import BaseInputNumber from "../../../component/public/BaseInputNumber";
import OrderDispatchSetting from './OrderDispatchConf';

export default class OrderDispatchDialog extends Component {
  state = {
    dispatchArr: [],//留底数据，参与比较
    fillModalVisible: false, //控制批量填充打开关闭状态
    fillEnd: '', //记录批量填充的结束序号
    value: '', //控制InputNumber的value
    currentNO: '', //当前点击行的序号
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.dataSource !== nextProps.dataSource){
      let dispatchArr = [];
      nextProps.dataSource.map((item) => {
        let obj = {};
        obj.sid = item.id;
        obj.rptPrepareBy = item.rptPrepareBy ? item.rptPrepareBy.id : null;
        obj.verifierId = item.verifier.verifier ? item.verifier.verifier.id : null;
        dispatchArr.push(obj);
      });
      this.setState({
        dispatchArr,
        currentNO: '',
      });
    }
  }

  render(){
    const { dispatchArr, fillModalVisible, fillEnd, value, currentNO } = this.state;
    const { onConfirm, onCancel, operationType, visible, dataSource } = this.props;
    const sampleDispatchTableSetting = OrderDispatchSetting.table.sampleDispatch;
    const sampleDispatchFormSetting = OrderDispatchSetting.form.sampleDispatchForm;

    const handleConfirm = () => {
      let afterFillData = [];//批量填充后的数据
      let modifyData = [];//批量填充后修改的数据
      dataSource.map((item) => {
        let obj = {};
        obj.sid = item.id;
        obj.rptPrepareBy = item.rptPrepareBy ? item.rptPrepareBy.id : null;
        obj.verifierId = item.verifier.verifier ? item.verifier.verifier.id : null;
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
      this.setState({
        dispatchArr: [],
      });
      onConfirm(modifyData);
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    // 打开批量填充modal，进行批量填充
    const openFillModal = () => {
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
    const onNumberChange = (value) => {
      this.setState({
        value,
      });
    }

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
    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={operationType}
        visible={visible}
        footer={
          <div>
            <Button style={{backgroundColor: '#52c41a', color: '#fff'}} type="default" size='large' onClick={openFillModal}>批量填充</Button>
            <Button type="primary" size='large' onClick={handleConfirm}>确认</Button>
            <Button type="default" size='large' onClick={handleCancel}>取消</Button>
          </div>
        }
        onCancel={handleCancel}
        >
          <AdvancedTable
            fillEnd={fillEnd}
            fillRule={[
              {changeKey: 'rptPrepareBy', judgmentKey: 'reportStatus', judgmentValue: ['已交付']},
              {changeKey: 'verifier.verifier', judgmentKey: 'processName', judgmentValue: ['已审核']}
            ]}
            onSelect={onSelect}
            isExpanded={false}
            setting={sampleDispatchTableSetting}
            data={dataSource}
            colNum={'1'}
            renderKey={['serialNo', 'testName']}
            simpleSearchKey={[['订单编号','orderNo'], ['样品编号','serialNo'], ['样品名称','testName']]}
            avancedSearchForm={sampleDispatchFormSetting}
          />
          <Modal
            title='批量填充'
            visible={fillModalVisible}
            onOk={bulkFill}
            onCancel={closeFillModal}
          >
            <span>目标行序号：</span><BaseInputNumber min={this.state.currentNO} max={this.props.dataSource.length} value={this.state.value} onChange={onNumberChange} />
          </Modal>
      </Modal>
    );
  }
}
