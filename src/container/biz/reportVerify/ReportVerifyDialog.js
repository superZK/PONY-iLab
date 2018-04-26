import React, {Component} from 'react';
import { Modal } from 'antd';
import fetchData from '../../../util/fetchGateway';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import ReportVerifySetting from './column';

export default class ReportVerifyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preparedItemKeys: [],
      userAccount: '',
     };
  }


  getSeverInfo = () => {
    fetchData('/sys/mode').then(
      (receipt) => {
        this.setState({
          userAccount: receipt.data[0] ? receipt.data[0].account : '',
        });
      },
      (error) => {console.log(error)}
    );
  }

  componentDidMount(){
    this.getSeverInfo();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible){
      if(this.refs.loginForm){
        this.refs.loginForm.setFieldsValue({
          userName: this.state.userAccount,
        });
      }
    }
  }

  render(){
    const { preparedItemKeys, userAccount } = this.state;
    const {
      onConfirm,
      onCancel,
      dataSource,
      visible,
      editType,
    } = this.props;

    const loginFormSetting = ReportVerifySetting.form.loginForm;
    const infoFormSetting = ReportVerifySetting.form.infoForm;
    const sampleVerifySetting = ReportVerifySetting.table.sampleVerify;

    const handleTableSelect = (rows, rowKeys) => {
      this.setState({
        preparedItemKeys: rowKeys,
      });
    }

    const userN = [];
    userN.userName = userAccount;

    const handleFormSubmitSuccess = () => {
      let obj = {};
      let loginObj = this.refs.loginForm.getFieldsValue();
      let infoObj = this.refs.infoForm.getFieldsValue();
      obj.userName = loginObj.userName;
      obj.signaturePassword = loginObj.signaturePassword;
      obj.verifyType = infoObj.verifyType;
      obj.memo = infoObj.memo;
      obj.verifyId = preparedItemKeys;
      onConfirm(obj);
      this.setState({
        preparedItemKeys: [],
      });
    };

    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={editType}
        visible={visible}
        onOk={handleFormSubmitSuccess}
        onCancel={onCancel} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:60}}>
              <BaseForm
                ref = 'loginForm'
                colNum = {'1.5'}
                footerRule = {'确认'}
                submitTitleClass = {{display:'none'}}
                setting = {loginFormSetting}
                visible = {visible}
                editObject={userN}
              />
            </div>
            <div className="panel-body">
              <BaseTable
                visible = {visible}
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
                    footerRule = {'确认'}
                    submitTitleClass = {{display:'none'}}
                    setting = {infoFormSetting}
                    visible = {visible}
                  />
                </div>
              </div>
            </div>
          </div>
      </Modal>
    );
  }
}
