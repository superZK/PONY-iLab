import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import StoreSetting from './column';

export default class StandingBookStore extends Component{
  render() {
    const {
      visible,
      editType,
      data,
      onCancel,
      storesClick,
    } = this.props;

    const materalInfoForm = StoreSetting.form.materalInfoForm;
    const standingBookSet = StoreSetting.table.standingBook;


    const handleSubmitSuccess = (values) => {
      console.log(values);
    }

    // 更改 editObject 数据结构
    storesClick.code = storesClick.info && storesClick.info.code;
    storesClick.name = storesClick.info && storesClick.info.name;

    return (
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={editType}
        visible={visible}
        onOk={handleSubmitSuccess}
        onCancel={() => onCancel()} >
        <div className="panel panel-info" style={{margin:0}}>
          <div className="panel-heading" >
            <p style={{color: 'black', margin: '15px 0'}}>· 物料信息</p>
            <BaseForm
              setting = {materalInfoForm}
              visible={visible}
              colNum = {'1'}
              footerRule = {'确认'}
              submitTitleClass = {{display:'none'}}
              editObject={storesClick}
            />
            <p style={{color: 'black', margin: '15px 0'}}>· 出入库信息</p>
            <BaseTable
              options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
              onPrepare={false}
              onSelect={false}
              // hideRowSelection={true}
              isExpanded={false}
              setting={standingBookSet}
              data={data}
            />
          </div>
        </div>
      </Modal>
    )
  }
}
