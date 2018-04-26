import React, {Component} from 'react';
import fetchData from '../../../util/fetchGateway';
import { Modal, message } from 'antd';
import SearchableSelector from '../../public/SearchableSelector';
import BaseForm from '../../public/BaseForm';
import SearchableTable from '../../public/SearchableTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import Setting from '../../../config/index';
import { AddKeyForData } from '../../../util/treeUtils';

export default class TestItemAddEditDialog extends Component {
  state = {
    testItemData: [],
    selectItemKey: [],
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible && this.props.testProgram && this.props.testProgram.testPlanName !== '全项'){
      this.setState({
        selectItemKey: [],
      });
      let url ='/doc/producttest/refFlow?tid=' + this.props.testProgram.id;
      fetchData(url).then(
        (receipt) => {
          let testItemData = AddKeyForData(receipt.data);
          this.setState({
            testItemData,
          });
        },
        (error) => {console.log(error)}
      );
    }
  }

  render(){
    const { testItemData, selectItemKey, } = this.state;
    const { onFormSubmit, onFormCancel, editItem, testProgram, editType } = this.props;
    const productTestFlowFormSetting = Setting.ProductSetting.form.productTestFlow;
    const productTestItemFormSetting = Setting.ProductSetting.form.productTestItem;
    const searchProgramFormSetting = Setting.ProductSetting.form.searchProgramForm;
    const productTestItemTableSetting = Setting.ProductSetting.table.productTestFlow;
    const setting = this.props.editType === '编辑' ? productTestItemFormSetting : productTestFlowFormSetting;
    // 获取检测项目表格勾选项
    const onPrepare = (row, rowKey) => {
      this.setState({
        selectItemKey: rowKey,
      });
    }

    // 添加
    const confirmAdd = () => {
      const testPlanName = testProgram && testProgram.testPlanName;
      if(testPlanName !== '全项' && editType === '添加'){
        if(!selectItemKey.length > 0){
          message.info('请先选择检测项目!');
          return;
        }
        onFormSubmit(selectItemKey, testPlanName);
        this.setState({
          selectItemKey: [],
        });
      }else{
        let testItemObj = this.refs.form.getFieldsValue();
        let validateStatus = '';
        this.refs.form.validateFields(['testItemId','testStandardId','testMethodId','serveGroupId'], (err, v) => {validateStatus = err});//自行添加表单验证
        // 如果没有通过表单校验，直接返回
        if(validateStatus && Object.keys(validateStatus).length){
          return;
        }
        onFormSubmit(testItemObj, testPlanName);
      }
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onFormCancel();
    }

    const selectAddCOMP = (testProgram, editType) => {
      let testPlanName = '';
      if(testProgram)
        testPlanName = testProgram.testPlanName;
      if(testPlanName !== ('全项') && (editType === '添加' || editType === '')){
        return (
          <AdvancedTable
          mode={'Search'}
          pagination={{pageSize:5, showQuickJumper:true}}
          onPrepare={onPrepare}
          isExpanded={true}
          setting={productTestItemTableSetting}
          data={testItemData}
          colNum={'1'}
          simpleSearchKey={[['名称','testItem.name'],['','testMethod.name'],['','testStandard.name'],['','testMethod.methodNameZH'], ['标准号','testMethod.standardNo'], ['','testStandard.code'], ['快捷码','shorthand']]}
          avancedSearchForm={searchProgramFormSetting}
        />);
      }else{
        return (
          <BaseForm
            ref='form'
            colNum = {'1.5'}
            footerRule = {'null'}
            submitTitleClass = {{display:'none'}}
            editObject = {editItem}
            setting = {setting}
            visible = {this.props.visible}
          />);
      }
    }

    return(
      <Modal
        style={{top:40}}
        width = {'1200'}
        title={`${this.props.editType}检测项目`}
        visible={this.props.visible}
        onOk={confirmAdd}
        onCancel={handleCancel} >
        {selectAddCOMP(testProgram, this.props.editType)}
      </Modal>
    );
  }
}
