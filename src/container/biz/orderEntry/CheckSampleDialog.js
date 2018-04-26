import React, {Component} from 'react';
import moment from 'moment';
import { Modal } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import OrderEntrySetting from './OrderEntryConf';
import { analysisDataIndex } from '../../../util/treeUtils';

export default class CheckSampleDialog extends Component {
  state = {
    sampleData: {},
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.checkedSample.id){
      let sampleData = nextProps.checkedSample;
      let productName = analysisDataIndex(sampleData, 'docProductTest.product.name');
      let productGradeName = analysisDataIndex(sampleData, 'docProductTest.productGrade.name');
      let testPlanName = analysisDataIndex(sampleData, 'docProductTest.testPlan.name');
      sampleData.product = `${productGradeName}-${testPlanName}-${productName}`;
      if(sampleData.sampleingDate && (sampleData.sampleingDate)._isAMomentObject)
      sampleData.sampleingDate = moment(sampleData.sampleingDate, 'YYYY-MM-DD');
      if(sampleData.mfgData && (sampleData.mfgData)._isAMomentObject)
      sampleData.mfgData = moment(sampleData.mfgData, 'YYYY-MM-DD');
      this.setState({
        sampleData: sampleData,
      });
    }
  }
  
  render(){
    const { onFormCancel, checkedSample } = this.props;
    const sampleFormSetting = OrderEntrySetting.form.checkSample;

    const handleCancel = (e)  => {
      e.preventDefault();
      onFormCancel();
    }

    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'查看样品信息'}
        visible={this.props.visible}
        footer={null}
        onCancel={handleCancel} >
        <BaseForm
          colNum = {'1.5'}
          editObject = {this.state.sampleData}
          setting = {sampleFormSetting}
          footerRule = {'null'}
          submitTitleClass = {{display:'none'}}
          onCancel = {handleCancel}
          visible = {this.props.visible}
        />
      </Modal>
    );
  }
}

