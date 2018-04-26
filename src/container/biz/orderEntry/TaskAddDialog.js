import React, {Component} from 'react';
import { Modal, Button, message } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import AdvancedTable from '../../../component/public/Table/AdvancedTable';
import OrderEntrySetting from './OrderEntryConf';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TaskAddDialog extends Component {
  state = { preparedItemKeys: [] };
  render(){
    const { preparedItemKeys } = this.state;
    const { onConfirm, onCancel, selectedSample, productTestFlow, selectedSampleKey } = this.props;
    const taskFormSetting = OrderEntrySetting.form.task;
    const productTestFlowTableSetting = OrderEntrySetting.table.productTestFlow;

    const handleTableSelect = (rows, rowKeys) => {
      this.setState({
        preparedItemKeys: rowKeys,
      });
    }

    const handleFormSubmitSuccess = () => {
      let obj = this.refs.baseform.getFieldsValue();
      let validateStatus = '';
      this.refs.baseform.validateFields(['status'], (err, v) => {validateStatus = err});//自行添加表单验证
      if(!preparedItemKeys.length){
        message.info('请先选择检测项目!');
        return;
      }
      // 如果没有通过表单校验，直接返回
      if(validateStatus && Object.keys(validateStatus).length){
        return;
      }
      obj.subordinate = preparedItemKeys;
      onConfirm(obj, selectedSampleKey);
      this.setState({
        preparedItemKeys: [],
      });
    };

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'新增任务'}
        visible={this.props.visible}
        onOk={handleFormSubmitSuccess}
        onCancel={handleCancel} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:95}}>
              <BaseForm
                ref = 'baseform'
                colNum = {'1'}
                footerRule = {'确认'}
                submitTitleClass = {{display:'none'}}
                setting = {taskFormSetting}
                onFormSubmitSuccess = {handleFormSubmitSuccess}
                visible = {this.props.visible}
              />
            </div>
            <div className="panel-body">
              <AdvancedTable
                mode = {'Simple'}
                visible = {this.props.visible}
                options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                isExpanded={false}
                onPrepare={handleTableSelect}
                setting={productTestFlowTableSetting}
                data={productTestFlow}
              />
            </div>
          </div>
      </Modal>
    );
  }
}
