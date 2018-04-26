import React from 'react';
import { Input, Icon, Badge, } from 'antd';
import EditableTable from '../../../component/public/EditableTable';
import EditableTableCell from '../../../component/public/EditableTableCell';
import SearchableSelector from "../../../component/public/SearchableSelector";
import { switchStatus, analysisDataIndex } from '../../util/treeUtils';

const ReportEntrySetting = {
  table: {
    sample:{
			key:'sample',
			name:'样品',
			column:[
					{
						title: '样品名称',
						dataIndex: 'testName',
						key: 'testName',
					},{
						title: '样品编号',
						dataIndex: 'serialNo',
						key: 'serialNo',
					},
				],
		},
    task:{
			key:'task',
			name:'检测任务',
			column:[
					{
						title: '检测项目名称',
						dataIndex: 'docProductTestFlow.testItem.name',
						key: 'testItemName',
					},{
						title: '检测项目代码',
						dataIndex: 'docProductTestFlow.testItem.code',
						key: 'testItemCode',
					},{
						title: '重复次数',
						dataIndex: 'docProductTestFlow.numReplicates',
						key: 'replicatedCount',
					},{
						title: '检测方法标准号',
						dataIndex: 'docProductTestFlow.testMethod.standardNo',
						key: 'testStandardCode',
					}, {
						title: '检测方法',
						dataIndex: 'docProductTestFlow.testMethod.methodNameZH',
						key: 'testMethodName'
					}, {
						title: '审核人',
						dataIndex: 'verifier.verifier.name',
						key: 'verifierName'
					}, {
						title: '状态点',
						dataIndex: 'statusPoint',
						key: 'statusPoint',
						render: (text, record) => {
							switch(record.verifier.processStatus.processName){
								case '录入':
									return (<Badge status="processing" text="待录入" />);
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
						}
			    }, {
						title: '是否合格',
						dataIndex: 'inSpec',
						key: 'inSpec',
						render: (text, record) => (
						record.inSpec ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					),
					}, {
						title: '禁用状态',
						dataIndex: 'disable',
						key: 'disable',
						render: (text, record) => (
						record.disable ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					),
					},
				],
		},
		record:{
			key:'record',
			name:'结果录入',
			column:[
					{
						title: '结果项名称',
						dataIndex: 'recordStandard.name',
						key: 'name',
						width: 120,
					},{
						title: '原始结果',
						dataIndex: 'originalResults',
						key: 'originalResults',
						width: 180,
						needAdvancedRender: true,
            renderType: '可编辑',
            render: {
              editingMethod: '文本',
            }
					},{
						title: '最终结果',
						dataIndex: 'finalResult',
						key: 'finalResult',
						width: 100,
					},{
						title: '计量单位',
						dataIndex: 'measureUnit.id',
						key: 'measUnitName',
						width: 150,
						needAdvancedRender: true,
            renderType: '可编辑',
            render: {
              editingMethod: '选择',
              url: '/doc/measunit/select',
            },
					},{
						title: '重复次数',
						dataIndex: 'numReplicates',
						key: 'numReplicates',
						width: 100,
					},{
						title: '修约规则',
						dataIndex: 'recordStandard.round',
						key: 'round',
						width: 100,
					},{
						title: '修约位数',
						dataIndex: 'recordStandard.places',
						key: 'places',
						width: 100,
					}, {
						title: '最大值',
						dataIndex: 'recordStandard.max',
						key: 'max',
						width: 100,
					}, {
						title: '最小值',
						dataIndex: 'recordStandard.min',
						key: 'min',
						width: 100,
					},{
						title: '审核人',
						dataIndex: 'verifier.verifier.name',
						key: 'verifiers',
						width: 100,
					}, {
						title: '状态点',
						dataIndex: 'statusPoint',
						key: 'statusPoint',
						needAdvancedRender: true,
						renderType: '状态点',
						render: {
							processStatus: 'verifier.processStatus.processName',
							processRule: (status) => {
								switch(status){
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
							}
						},
						width: 100,
			    }, {
						title: '是否合格',
						dataIndex: 'sampleTestTask.inSpec',
						key: 'inSpec',
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
						width: 100,
					}, {
						title: '报告项',
						dataIndex: 'reportable',
						key: 'reportable',
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
						width: 80,
					},
				],
		},
		result:{
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
					},{
						title: '最终结果',
						dataIndex: 'finalResult',
						key: 'finalResult',
					},{
						title: '计量单位',
						dataIndex: 'measureUnit.name',
						key: 'measUnitName',
					},{
						title: '重复次数',
						dataIndex: 'numReplicates',
						key: 'numReplicates',
					},{
						title: '修约规则',
						dataIndex: 'round',
						key: 'round',
					},{
						title: '修约位数',
						dataIndex: 'places',
						key: 'places',
					}, {
						title: '最大值',
						dataIndex: 'max',
						key: 'max'
					}, {
						title: '最小值',
						dataIndex: 'min',
						key: 'min'
					},{
						title: '审核人',
						dataIndex: 'verifier.verifier.name',
						key: 'verifiers'
					}, {
						title: '状态点',
						dataIndex: 'statusPoint',
						key: 'statusPoint',
						needAdvancedRender: true,
						renderType: '状态点',
						render: {
							processStatus: 'verifier.processStatus.processName',
							processRule: (status) => {
								switch(status){
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
							}
						},
			    }, {
						title: '是否合格',
						dataIndex: 'sampleTestTask.inSpec',
						key: 'inSpec',
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
					}, {
						title: '报告项',
						dataIndex: 'reportable',
						key: 'reportable',
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
					},
				],
		},
  },
  form: {
		addVerifier:{
			submitTitle: '确定',
			items: [
				{key: 'verifyer', label: '审核人', component: (
					<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={false}
					renderKey={['code']}
					url='/auth/user/select'
					/>), rules: [{required: true, message: '请选择审核人'}]},
			],
		},
  }
}
export default ReportEntrySetting;