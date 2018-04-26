import React, {Component} from 'react';
import { Modal, Button, message } from 'antd';
import fetchData from '../../../util/fetchGateway';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import DataVerifySetting from './DataVerifyConf';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SampleVerifyDialog extends Component {
  state = {
    preparedItemKeys: [],
    userAccount: '',
   };

   componentWillReceiveProps(nextProps) {
    if(nextProps.visible){
      let userAccount = '';
      fetchData('/sys/mode').then(
        (receipt) => {
          userAccount = receipt.data ? receipt.data[0].account : '';
          if(this.refs.loginForm){
            this.refs.loginForm.setFieldsValue({
              userName: userAccount,
            });
          }
          this.setState({
            userAccount,
          });
        },
        (error) => {console.log(error)}
      );
    }
  }

  render(){
    const { preparedItemKeys } = this.state;
    const { onConfirm, onCancel, dataSource } = this.props;
    const loginFormSetting = DataVerifySetting.form.loginForm;
    const infoFormSetting = DataVerifySetting.form.infoForm;
    const sampleVerifySetting = DataVerifySetting.table.sampleVerify;

    const handleTableSelect = (rows, rowKeys) => {
      let sampleIds = rows.map( item => item.sampleId);
      this.setState({
        preparedItemKeys: sampleIds || [],
      });
    }

    const handleFormSubmitSuccess = () => {
      let obj = {};
      let loginObj = this.refs.loginForm.getFieldsValue();
      let infoObj = this.refs.infoForm.getFieldsValue();
      let validateStatus = '';
      this.refs.infoForm.validateFields(['approved'], (err, v) => {validateStatus = err});//自行添加表单验证
      if(!preparedItemKeys.length){
        message.info('请选择审核数据!');
        return;
      }
      // 如果没有通过表单校验，直接返回
      if(validateStatus && Object.keys(validateStatus).length){
        return;
      }
      obj.userName = loginObj.userName;
      obj.signaturePassword = loginObj.signaturePassword;
      obj.auditSuggestion = {};
      obj.auditSuggestion.verifyStatus = infoObj.approved;
      obj.auditSuggestion.remark = infoObj.auditOpinion || '';
      obj.verifyId = preparedItemKeys;
      onConfirm(obj);
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
        title={this.props.editType}
        visible={this.props.visible}
        onOk={handleFormSubmitSuccess}
        onCancel={handleCancel} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:60}}>
              <BaseForm
                ref = 'loginForm'
                colNum = {'1.5'}
                footerRule = {'null'}
                submitTitleClass = {{display:'none'}}
                setting = {loginFormSetting}
                onFormSubmitSuccess = {handleFormSubmitSuccess}
                visible = {this.props.visible}
              />
            </div>
            <div className="panel-body">
              <BaseTable
                visible = {this.props.visible}
                options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                isExpanded={false}
                onPrepare={handleTableSelect}
                setting={sampleVerifySetting}
                data={dataSource}
              />
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-heading" style={{height:176}}>
                  <BaseForm
                    style = {{transform: 'translate(-100px, 0)'}}
                    ref = 'infoForm'
                    colNum = {'3'}
                    footerRule = {'null'}
                    submitTitleClass = {{display:'none'}}
                    setting = {infoFormSetting}
                    onFormSubmitSuccess = {handleFormSubmitSuccess}
                    visible = {this.props.visible}
                  />
                </div>
              </div>
            </div>
          </div>
      </Modal>
    );
  }
}
