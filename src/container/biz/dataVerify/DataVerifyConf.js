import React from 'react';
import { Input, Icon, Badge } from 'antd';
import BaseRadio from '../../../component/public/BaseRadio';

const DataVerifySetting = {
  table: {
    orders:{
			key:'orders',
			name:'订单',
			column:[
					{
						title: '订单编号',
						dataIndex: 'orderNo',
						key: 'orderNo',
					},
				],
		},
    sample:{
		key:'sample',
		name:'样品',
		column:[
				{
					title: '样品编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
				},{
					title: '样品名称',
					dataIndex: 'testName',
					key: 'testName',
				},{
					title: '检测项目',
					dataIndex: 'testItemName',
					key: 'testItemName',
				},{
					title: '检测方法',
					dataIndex: 'testMethodName',
					key: 'testMethodName',
				},{
					title: '检测标准',
					dataIndex: 'testStandardName',
					key: 'testStandardName',
				},{
					title: '登记时间',
					dataIndex: 'loginDate',
					key: 'loginDate',
				},{
					title: '登记人',
					dataIndex: 'loginBy',
					key: 'loginBy',
				},{
					title: '服务组',
					dataIndex: 'serviceGroup',
					key: 'serviceGroup',
				},{
					title: '接收时间',
					dataIndex: 'receivedDate',
					key: 'receivedOn',
				},{
					title: '接收人',
					dataIndex: 'receivedBy',
					key: 'receivedBy',
				},
			],
	},
	result:{
		key:'result',
		name:'任务与结果项',
		column:[
				{
					title: '结果项名称',
					dataIndex: 'resultName',
					key: 'resultName',
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
					dataIndex: 'recordStandard.numReplicates',
					key: 'numReplicates',
				},{
					title: '修约规则',
					dataIndex: 'recordStandard.round',
					key: 'round',
				},{
					title: '修约位数',
					dataIndex: 'recordStandard.places',
					key: 'places',
				},{
					title: '最大值',
					dataIndex: 'recordStandard.max',
					key: 'max',
				},{
					title: '最小值',
					dataIndex: 'recordStandard.min',
					key: 'min',
				},{
					title: '报告项',
					dataIndex: 'reportable',
					key: 'reportable',
					render: (text, record) => (
						record.reportable ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					),
				},{
					title: '是否合格',
					dataIndex: 'inSpec',
					key: 'inSpec',
					render: (text, record) => (
						record.inSpec ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					  ),
				},
			],
	},
	sampleVerify:{
		key:'sampleVerify',
		name:'样品任务审核',
		column:[
			{
				title: '样品编号',
				dataIndex: 'serialNo',
				key: 'serialNo',
			},{
				title: '样品名称',
				dataIndex: 'testName',
				key: 'testName',
			},{
				title: '检测项目',
				dataIndex: 'testItemName',
				key: 'testItemName',
			},{
				title: '检测方法',
				dataIndex: 'testMethodName',
				key: 'testMethodName',
			},{
				title: '检测标准',
				dataIndex: 'testStandardName',
				key: 'testStandardName',
			},{
				title: '是否合格',
				dataIndex: 'inSpec',
				key: 'inSpec',
				render: (text, record) => (
					record.inSpec ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					),
			},
			],
	},
	resultVerify:{
		key:'resultVerify',
		name:'结果审核',//还有两个合格未添加
		column:[
			{
				title: '样品编号',
				dataIndex: 'serialNo',
				key: 'serialNo',
			},{
				title: '样品名称',
				dataIndex: 'testName',
				key: 'testName',
			},{
				title: '检测项目',
				dataIndex: 'testItemName',
				key: 'testItemName',
			},{
				title: '检测方法',
				dataIndex: 'testMethodName',
				key: 'testMethodName',
			},{
				title: '检测标准',
				dataIndex: 'testStandardName',
				key: 'testStandardName',
			},{
				title: '结果项名称',
				dataIndex: 'name',
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
				title: '最大值',
				dataIndex: 'max',
				key: 'max',
			},{
				title: '最小值',
				dataIndex: 'min',
				key: 'min',
			},{
				title: '计量单位',
				dataIndex: 'measUnitName',
				key: 'measUnitName',
			},
			// {
			// 	title: '文本指标',
			// 	dataIndex: 'testStandardName',
			// 	key: 'testStandardName',
			// },{
			// 	title: '录入人',
			// 	dataIndex: 'testStandardName',
			// 	key: 'testStandardName',
			// },{
			// 	title: '录入时间',
			// 	dataIndex: 'testStandardName',
			// 	key: 'testStandardName',
			// },
			{
				title: '审核人',
				dataIndex: 'verifiers',
				key: 'verifiers',
			},{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
			},
			],
	},
  },
  form: {
	loginForm:{
		submitTitle: '登录',
		items: [
			{key: 'userName', label: '用户名', component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />), rules: [{required: true, message: '请输入用户名'}]},
			{key: 'signaturePassword', label: '签名密码', component: (<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />), rules: [{required: true, message: '请输入签名密码'}]},
		],
	},
	infoForm:{
		submitTitle: '确定',
		items: [
			{key: 'approved', label: '审批', component: (
				<BaseRadio
				data = {[{label:'通过', value:'3'},{label:'退回', value:'4'}]}
				/>), rules: [{required: true, message: '请选择审批结果'}]},
			{key: 'auditOpinion', label: '审核意见', component: (<Input.TextArea autosize={{minRows: 4, maxRows: 4}} />), rules: [{}]},
		],
	},
	taskInfoForm:{
		submitTitle: '确定',
		items: [
			{key: 'approved', label: '审批', component: (
				<BaseRadio
				data = {[{label:'通过', value:'3'},{label:'退回', value:'4'},{label:'重测', value:'5'}]}
				/>), rules: [{required: true, message: '请选择审批结果'}]},
			{key: 'auditOpinion', label: '审核意见', component: (<Input.TextArea autosize={{minRows: 4, maxRows: 4}} />), rules: [{}]},
		],
	},
  }
}
export default DataVerifySetting;