import React, {Component} from 'react';
import {Modal, message} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import StoreSetting from './column';

export default class OrderStore extends Component{
  render() {
    const {
      visible,
      editType,
      data,
      onCancel,
    } = this.props;

    const purchaseNoteForm = StoreSetting.form.purchaseNoteForm;
    const purchaseNoteSet = StoreSetting.table.purchaseNote;


    const handleSubmitSuccess = (values) => {
      console.log(values);
    }


    return (
      <Modal
        style={{top:40}}
        width={'1000px'}
        title={editType}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <p style={{color: 'black', margin: '15px 0'}}>· 物料信息</p>
            <BaseForm
              setting = {purchaseNoteForm}
              visible={visible}
              colNum = {'1.5'}
              footerRule = {'确认'}
              submitTitleClass = {{display:'none'}}
              // editObject={editInfo}
            />
            <p style={{color: 'black', margin: '15px 0'}}>· 采购明细</p>
            <BaseTable
              options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
              onPrepare={false}
              onSelect={false}
              // hideRowSelection={true}
              isExpanded={false}
              setting={purchaseNoteSet}
              data={data}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
