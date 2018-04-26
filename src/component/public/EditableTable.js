import React, { Component } from 'react';
import EditableTableCell from './EditableTableCell';
import BaseTable from './BaseTable';
import SecurityButtonBox from './SecurityButtonBox';
import { Input, Icon, Button, Badge, } from 'antd';
import {switchStatus, fomatFloat, analysisDataIndex} from '../../util/treeUtils';

export default class EditableTable extends Component {
  state = {
    dataSource: [],
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.dataSource !== nextProps.data){
      this.setState({
        dataSource: nextProps.data
      });
    }
  }

  // 文本类型编辑
  onTextCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = this.state.dataSource;
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }

  // 选择类型编辑
  onSelectCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = this.state.dataSource;
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }

  render() {
    const { dataSource } = this.state;

    const setting = {
			key:'result',
			name:'结果项',
			column:[
					{
						title: '结果项名称',
						dataIndex: 'recordStandard.name',
						key: 'name',
					},{
						title: '原始结果',
						dataIndex: 'originalResults',
            key: 'originalResults',
            render: (text, record) => {
              return (
                <EditableTableCell
                  value={record.resultsFile ? record.originalResults : text}
                  resultType={record.resultType}
                  max={record.max || 10}
                  min={record.min || 0}
                  status={record.processName || ''}
                  url={'/biz/order/report/resultsFile/select?resultsFileId=' + record.resultsFile}
                  onChange={this.onTextCellChange(record.key, 'originalResults')}
                />
              );
            }
					},{
						title: '最终结果',
						dataIndex: 'finalResult',
						key: 'finalResult',
            render: (text, record) => {
              const originalResults = record && record.originalResults;
              const places = record && record.places;
              switch(record.round){
								case '512001':
									return fomatFloat(originalResults, places)
								case '512002':
									return Number(originalResults).toFixed(Number(places));
                case '512003':
									return fomatFloat(originalResults, 0)
                case '512004':
									return Number(originalResults).toFixed(0);
								default:
									return '空';
							}
            }
					},{
						title: '计量单位',
						dataIndex: 'measureUnit',
            key: 'measUnitId',
            render: (text, record) => (
              <EditableTableCell
                resultType={'选择'}
                url={'/doc/measunit/select'}
                status={record.processName || ''}
                value={record.measUnitId || '' + ''}
                onChange={this.onSelectCellChange(record.key, 'measUnitId')}
              />
            ),
					},{
						title: '重复次数',
						dataIndex: 'numReplicates',
						key: 'numReplicates',
					}, {
						title: '修约规则',
						dataIndex: 'recordStandard.round',
						key: 'round'
					}, {
						title: '修约位数',
						dataIndex: 'recordStandard.places',
						key: 'places'
					}, {
						title: '最大值',
						dataIndex: 'recordStandard.max',
						key: 'max'
					}, {
						title: '最小值',
						dataIndex: 'recordStandard.min',
						key: 'min'
					}, {
            title: '审核人',
            dataIndex: 'verifier.verifier.name',
            key: 'verifiers'
          }, {
            title: '状态点',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
              switch(analysisDataIndex(record, 'verifier.processStatus.processName')){
								case null:
									return (<Badge status="processing" text="待录入" />);
								case '录入':
									return (<Badge status="processing" text="已录入" />);
								case '待审':
									return (<Badge status="success" text="待审核" />);
								case '己审核':
									return (<Badge status="success" text="己审核" />);
								case '退回':
									return (<Badge status="error" text="退回" />);
								case '重测':
									return (<Badge status="error" text="重测" />);
								default:
									return (<Badge status="Default" text="未录入系统" />);
							}
            },
          }, {
						title: '是否合格',
						dataIndex: 'sampleTestTask.inSpec',
						key: 'inSpec',
						render: (text, record) => (
						record.inSpec ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					  ),
					}, {
						title: '报告项',
						dataIndex: 'reportable',
						key: 'reportable',
						render: (text, record) => (
						record.reportable ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					  ),
					},
				],
    }

    // 保存
    const handleSave = () => {
      if(this.props.onSave)
      this.props.onSave(dataSource);
    }

    return(
      <div style={{marginTop: 10}}>
        <div style = {{marginBottom: 10}}>
          <SecurityButtonBox>
            <Button key={'lab.testResult.make.save'} type="primary" onClick={handleSave} >保存修改</Button>
          </SecurityButtonBox>
        </div>
        <BaseTable
          options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
          onPrepare={this.props.onPrepare || null}
          onSelect={this.props.onSelect | null}
          hideRowSelection={false}
          isExpanded={false}
          notNeedIdToKey={true}
          setting={setting}
          data={this.props.data}
        />
      </div>
      );
  }
}
