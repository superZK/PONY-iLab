import React, {Component} from 'react';
import { Modal, message } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import SearchableSelector from '../../../component/public/SearchableSelector';
import SearchableTable from "../../../component/public/SearchableTable";
import QualificationManageSetting from './column'
import moment from 'moment'


export default class AddQualification extends Component{
  state = {
    siteId: '',
  }
  render() {
    const {
      siteId,
    } = this.state;

    const {
      visible,
      onCancel,
      onEndSubmit,
      qualificationAddTitle,
      temporaryStoredTitleAdd,
      qualificationKey,
      rowKeysAdd
    } = this.props

    // 组织更改后，清空部门选项
    const handleSiteChange = (value) =>{
      this.setState({
        siteId: value || '',
      });
      this.refs.qualificationForm.setFieldsValue({deptId: ''});
    }

    const siteSelect = {key: 'siteId', label: '组织', component: (
      <SearchableSelector
        options={{allowClear:true}}
        onChange={handleSiteChange}
        disabled={false}
        lazyMode={false}
        url='/org/site/select' />
    ), rules: [{ message: '请选择组织'}]};

    const deptSelect = {key: 'deptId', label: '部门', component: (
      <SearchableSelector
        options={{allowClear:true}}
        disabled={false}
        lazyMode={false}
        url={'/org/dept/select/506501?siteId=' + siteId} />
    ), rules: [{required: true, message: '请选择部门'}]};

    const qualifySetting = QualificationManageSetting.form.addQualify;
    qualifySetting.items[0] = siteSelect;
    qualifySetting.items[1] = deptSelect;
    const qualificationTableSetting = QualificationManageSetting.table.addQualify;

    // 暂存新增搜索抬头
    const handleFormSubmitSuccess = (values) => {
      qualificationAddTitle(values.deptId, values.qualificationTypeId, values.s)
    }

    // 获取表格选择列表
    const handleTableSelect = (rows, rowKeys) => {
      qualificationKey(rows, rowKeys)
    }

    // 表单发送请求成功与失败
    const handleSubmitSuccess = () => {
      let values = this.refs.qualificationForm.getFieldsValue();
      this.refs.qualificationForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.productTestFlowList = rowKeysAdd;
          values.effectDate ? moment(values.effectDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
          values.expiryDate ? moment(values.expiryDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

          if (values.effectDate === undefined || values.effectDate === '') {
            return message.error('请输入生效日期')
          } else if(values.expiryDate === undefined || values.expiryDate === '') {
            return message.error('请输入失效日期')
          } else {
            onEndSubmit(values, values.deptId, values.qualificationTypeId)
          }
        } else {
          return false
        }
      })
    }

    return (
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'新增资质'}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading">
            <BaseForm
              ref = 'qualificationForm'
              colNum={1.5}
              setting = {qualifySetting}
              visible={visible}
              onFormSubmitSuccess = {handleFormSubmitSuccess}
              // submitTitleClass = {{marginLeft:10, transform: 'translate(0px, -62px)'}}
              footerRule = {'确认'}
            />
          </div>
          <div className="panel-body">
            <SearchableTable
              options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
              isExpanded={false}
              colNum={'1'}
              simpleSearchKey={['testItemName', 'testStandardCode', 'testStandardName', 'testMethodName', 'testMethodStandardNo']}
              avancedSearchForm={false}
              onPrepare={handleTableSelect}
              setting={qualificationTableSetting}
              data={temporaryStoredTitleAdd} />
          </div>
        </div>
      </Modal>
    )
  }
}
