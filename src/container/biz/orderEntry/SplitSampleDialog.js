import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseForm from "../../../component/public/BaseForm";
import BaseTable from "../../../component/public/BaseTable";
import OrderEntrySetting from './OrderEntryConf';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SplitSampleDialog extends Component {
  state = { sid: [], dataSource: [], preparedItem: [], };
  render(){
    const { sid, dataSource, preparedItem, } = this.state;
    const { onConfirm, onCancel, selectedSample, } = this.props;
    const splitSampleFormSetting = OrderEntrySetting.form.splitSample;
    const splitSampleTableSetting = OrderEntrySetting.table.splitSample;

    const handleTableSelect = (rows, rowKeys) => {
      this.setState({
        sid: rowKeys,
        preparedItem: rows,
      });
    }

    const handleConfirm = () => {
      if(preparedItem.length === 0) return;
      preparedItem.map( (item)  => {
        delete item.key;//delete可以删除对象中的该字段
        delete item.id;
        return item;
      });
      onConfirm(preparedItem, selectedSample);
      this.setState({
        dataSource: [],
      });
    }

    // 表单发送请求成功与失败
    const handleFormSubmitSuccess = (value) => {
      let arr = this.state.dataSource;
      let date = Date.now();
      value.id = date;//为table添加唯一的key
      value.key = date + '';
      arr.push(value);
      this.setState({
        dataSource: arr,
      });
      this.refs.splitSampleForm.resetFields();
    };

    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }

    return(
      <Modal
        style={{top:40}}
        width={'1200px'}
        title={'拆样'}
        visible={this.props.visible}
        onOk={handleConfirm}
        onCancel={handleCancel} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:137}}>
              <BaseForm
                ref = 'splitSampleForm'
                colNum = {'1'}
                footerRule = {'确认'}
                submitTitleClass = {{transform: 'translate(15px, -46px)'}}
                setting = {splitSampleFormSetting}
                onFormSubmitSuccess = {handleFormSubmitSuccess}
                visible = {this.props.visible}
              />
            </div>
            <div className="panel-body">
              <BaseTable
                options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                isExpanded={false}
                onPrepare={handleTableSelect}
                setting={splitSampleTableSetting}
                data={dataSource}
              />
            </div>
          </div>
      </Modal>
    );
  }
}

