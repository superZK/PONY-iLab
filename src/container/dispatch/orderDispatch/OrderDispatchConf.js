import React from 'react';
import { Input, InputNumber, Radio, Icon, Select } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseRangePicker from "../../../component/public/BaseRangePicker";
import LocalDataSelect from "../../../component/public/Select/LocalDataSelect";
const RadioGroup = Radio.Group;
const Option = Select.Option;

const OrderDispatchSetting = {
	table:{
		orderQuery:{
			key:'orderQuery',
			name:'订单查询',
			column:[
					{
						title: '所属组织',
						dataIndex: 'siteName',
						key: 'siteName',
						width: 150
					},{
						title: '订单编号',
						dataIndex: 'ordersNo',
						key: 'ordersNo',
						width: 150
					},{
						title: '客户名称',
						dataIndex: 'applicationClient',
						key: 'applicationClient',
						width: 200
					},{
						title: '调度状态',
						dataIndex: 'disStatus',
						key: 'disStatus',
						width: 100
					},{
						title: '实验状态',
						dataIndex: 'testStatus',
						key: 'testStatus',
						width: 100
					}, {
						title: '下单日期',
						dataIndex: 'date',
						key: 'date',
						width: 100
					}, {
						title: '操作',
						dataIndex: 'action',
						key: 'action',
						width: 100,
						needAdvancedRender: true,
						renderType: '行操作',
						render: {},
					},
				],
		},
		sampleDispatch: {
			key:'sampleDispatch',
			name:'样品调度',
			column:[
				{
					title: '序号',
					dataIndex: 'serialNumber',
					key: 'serialNumber',
					width: 100
				},{
					title: '订单编号',
					dataIndex: 'ordersNo',
					key: 'ordersNo',
					width: 100
				},{
					title: '样品编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
					width: 100
				},{
					title: '样品名称',
					dataIndex: 'testName',
					key: 'testName',
					width: 100
				},{
					title: '报告状态',
					dataIndex: 'reportStatus',
					key: 'reportStatus',
					width: 100
				},{
					title: '审核状态',
					dataIndex: 'processName',
					key: 'processName',
					width: 100
				},{
					title: '编制人',
					dataIndex: 'rptPrepareBy.id',
					key: 'rptPrepareBy',
					width: 100,
					needCellClick: true,
					needAdvancedRender: true,
					renderType: '可编辑',
					render: {
						editingMethod: '选择',
						url: '/auth/user/select',
					}
				},{
					title: '审核人',
					dataIndex: 'verifier.verifier.id',
					key: 'verifier',
					width: 100,
					needCellClick: true,
					needAdvancedRender: true,
					renderType: '可编辑',
					render: {
						editingMethod: '选择',
						url: '/auth/user/select',
					}
				},
			],
		}
	},
	form:{
		orderQueryForm: {
			submitTitle: '查询',
			items: [
				{key: 'ordersNo', label: '订单编号', component: (<Input />)},
				{key: 'applicationClient', label: '客户名称', component: (<Input />)},
				{key: 'disStatus', label: '调度状态', component: (
					<LocalDataSelect
						data={[['调度完成', '调度完成'],['调度未完成', '调度未完成'],['已交付', '已交付'],['未交付', '未交付'],['完成', '完成'],['未完成', '未完成']]}
					/>), rules: []},
				{key: 'testStatus', label: '实验状态', component: (
					<LocalDataSelect
						data={[['完成', '完成'],['未完成', '未完成']]}
					/>), rules: []},
				{key: 'date', label: '时间段', component: (<BaseRangePicker />), rules: []},
			],
		},
		sampleDispatchForm: {
			submitTitle: '查询',
			items: [
				{key: 'ordersNo', label: '订单编号', component: (<Input />)},
				{key: 'serialNo', label: '样品编号', component: (<Input />)},
				{key: 'testName', label: '样品名称', component: (<Input />)},
				{key: 'reportStatus', label: '报告状态', component: (
					<LocalDataSelect
						data={[['调度完成', '调度完成'],['调度未完成', '调度未完成'],['已交付', '已交付'],['未交付', '未交付'],['完成', '完成'],['未完成', '未完成']]}
					/>), rules: []},
				{key: 'processName', label: '审核状态', component: (
					<LocalDataSelect
						data={[['录入', '录入'],['待审', '待审'],['已审核', '已审核']]}
					/>), rules: []},
			],
		},
  	},
}
export default OrderDispatchSetting;
