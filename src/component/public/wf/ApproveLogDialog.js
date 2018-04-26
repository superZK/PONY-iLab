import React, {Component} from 'react';
import {Modal} from 'antd';
import BaseTable from "../../../component/public/BaseTable";
import fetchData from '../../../util/fetchGateway';


export default class ApproveLogDialog extends Component{

  constructor(props){
    super(props);

    this.state = {
      data: [],
    };
  }

  loadData(pid){
    fetchData('/sys/wf/app/log?pid=' + pid, {}).then(
      (receipt) => {
        this.setState({
          data: null === receipt.data ? [] : receipt.data.map((log, index) => {
            log.key = (log.id + "");
            log.sn = index + 1;
            return log;
          })
        });
      },
      (error) => {console.log(error)}
    );
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible && !this.props.visible && nextProps.processId){
      console.log('--------' + nextProps.processId);
      this.loadData(nextProps.processId);
    }
  }

  render(){
    const tblSetting = {
      column:[
        {title: '序号', dataIndex: 'sn', key: 'sn', width: '50px'},
        {title: '操作人', dataIndex: 'operator.name', key: 'operator.name', width: '100px'},
        {title: '操作时间', dataIndex: 'bts', key: 'bts', width: '150px'},
        {title: '审核意见', dataIndex: 'memo', key: 'memo'},
        {title: '审核前状态', dataIndex: 'source.taskDef.name', key: 'source.taskDef.names', width: '100px'},
        {title: '审核后状态', dataIndex: 'target.taskDef.name', key: 'target.taskDef.names', width: '100px'}
      ]
    };
    return(
      <Modal
        title={"审批记录"}
        footer={null}
        visible={this.props.visible}
        width={'1000px'}
        onCancel={this.props.onCancel} >
        <BaseTable
          colNum = {'3'}
          hideRowSelection
          setting = {tblSetting}
          visible = {this.props.visible}
          data = {this.state.data}
        />
      </Modal>
    );
  }

}
