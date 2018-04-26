import React, {Component} from 'react';
import { Modal, Button, message } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import AdvancedTable from "../../../component/public/Table/AdvancedTable";
import SearchableSelector from "../../../component/public/SearchableSelector";
import ReportEntrySetting from './ReportEntryConf';

export default class AddVerifierDialog extends Component {
  state = {
    selectedItemIds: [],
  }
  render(){
    const {
      selectedItemIds,
    } = this.state;

    const {
      onConfirm,
      onCancel,
      resultData,
    } = this.props;

    const resultTableSetting = ReportEntrySetting.table.result;
    const addVerifierFormSetting = ReportEntrySetting.form.addVerifier;

    const onPrepare = (row, rowKey) => {
      let selectedItemIds = row.map(item => item.id);
      this.setState({
        selectedItemIds,
      });
    }

    const handleConfirm = () => {
      const form = this.refs.form;
      const verifierId = form.getFieldsValue().verifyer;
      // 添加表单验证
      let validateStatus = '';
      this.refs.form.validateFields(['verifyer'], (err, v) => {validateStatus = err});
      // 如果没有通过表单校验，直接返回
      if(validateStatus && Object.keys(validateStatus).length){
        return;
      }
      let notEnteredArr = [];
      selectedItemIds.map((item) => {
        if(item === 0){
          notEnteredArr.push(item);
        }
      });
      if(notEnteredArr.length > 0){
        message.warning('无法为未录入结果的结果项指定审核人,请先录入结果');
        return;
      }
      if(!selectedItemIds.length > 0){
        message.info('请选择结果项!');
        return;
      }
      onConfirm(verifierId, selectedItemIds);
    }

    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={this.props.editType}
        visible={this.props.visible}
        onOk={handleConfirm}
        onCancel={onCancel} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:60}}>
              <BaseForm
                ref='form'
                colNum = {'1'}
                footerRule = {'null'}
                submitTitleClass = {{display:'none'}}
                setting = {addVerifierFormSetting}
                visible = {this.props.visible}
              />
            </div>
            <div className="panel-body">
              <AdvancedTable
                options={ {pagination:{pageSize:4, showQuickJumper:true,}} }
                onPrepare={onPrepare}
                setting={resultTableSetting}
                renderKey={['recordStandard.name']}
                data={resultData}
              />
            </div>
          </div>
      </Modal>
    );
  }
}
