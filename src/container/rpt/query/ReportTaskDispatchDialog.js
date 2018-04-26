import React, {Component} from 'react';
import cloneDeep from "clone-deep";
import {Modal} from 'antd';
import AdvancedTable from "../../../component/public/AdvancedTable";
import fetchData from '../../../util/fetchGateway';
import settings from './setting';

export default class ReportTaskDispatchDialog extends Component{

  constructor(props){
    super(props);
    this.state = {
      data: [],
    };
  }

  getStructure(data){
    if(data && data.length > 0){
      let standard = data[0].process.task.map(x => x.taskDef.id);
      for(let report of data){
        let current = report.process.task.map(x => x.taskDef.id);
        if(current.length !== standard.length){
          console.log("流程环节定义不匹配：" + report.id);
          return null;
        }
        for(let def of current){
          if(!standard.includes(def)){
            console.log("流程环节定义不匹配：" + report.id);
            return null;
          }
        }
      }
      return data[0].process.task.map(x => x.taskDef);
    }
    return null;
  }

  loadData(reportsId){
    fetchData('/report/reportcompile/query/ids', {
      body: JSON.stringify(reportsId)
    }).then(
      (receipt) => {
        this.setState({
          data: null === receipt.data ? [] : receipt.data.map((report, index) => {
            report.key = (report.id + "");
            report.sn = index + 1;
            for(let task of report.process.task){
              if(task.assignee)
                report['__' + task.taskDef.id] = task.assignee.id
            }
            return report;
          })
        });

      },
      (error) => {console.log(error)}
    );
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible && !this.props.visible && nextProps.reportsId){
      this.loadData(nextProps.reportsId);
    }
  }

  render(){
    let tblSetting = cloneDeep(settings.table.reportTasks);
    let structure = this.getStructure(this.state.data);
    if(null !== structure){
      for(let taskDef of structure){
        tblSetting.column.push({
          title: taskDef.name,
          dataIndex: '__' + taskDef.id,
          width: 100,
          needCellClick: true,
          needAdvancedRender: true,
          renderType: '可编辑',
          render: {
            editingMethod: '选择',
            url: '/auth/user/select',
          }
        });
      }
    };

    let handleOK = () => {
      let processes = {};
      this.state.data.map((x) => {
        let pid = x.process.id;
        let assignees = {};
        for(let att in x){
          if(att.startsWith('__')){
            assignees[att.substr(2)] = x[att];
          }
        };
        processes[pid] = assignees;
        return pid;
      });
      this.props.onOk(processes);
    };


    return(
      <Modal
        title={`${this.props.editType}`}
        visible={this.props.visible}
        width={'1000px'}
        onCancel={this.props.onCancel}
        cancelText="取消"
        onOk={handleOK}
        okText="完成" >
        <AdvancedTable
          colNum = {'3'}
          hideSearch={true}
          hideRowSelection
          setting = {tblSetting}
          visible = {this.props.visible}
          data = {this.state.data}
        />
      </Modal>
    );
  }

}
