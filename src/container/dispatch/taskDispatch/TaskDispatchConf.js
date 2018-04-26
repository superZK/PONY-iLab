import React from 'react';
import { Input, InputNumber, Radio, Icon, } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseRangePicker from "../../../component/public/BaseRangePicker";
const RadioGroup = Radio.Group;

const TaskDispatchSetting = {
	table:{
		taskQuery:{
			key:'taskQuery',
			name:'任务查询调度',
			column:[
          {
            title: '序号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 50
          },{
				title: '订单编号',
				dataIndex: 'sampleType.orders.orderNo',
				key: 'ordersNo',
				width: 100
			},{
				title: '样品编号',
				dataIndex: 'sampleType.serialNo',
				key: 'sampleNo',
				width: 100
			},{
				title: '样品名称',
				dataIndex: 'sampleType.testName',
				key: 'testName',
				width: 150
			},{
				title: '检测项目',
				dataIndex: 'docProductTestFlow.testItem.name',
				key: 'testItemName',
				width: 150
			},{
				title: '检测标准',
				dataIndex: 'docProductTestFlow.testStandard.code',
				key: 'testStandard',
				width: 100
			},{
				title: '方法标准',
				dataIndex: 'docProductTestFlow.testMethod.standardNo',
				key: 'methodStandard',
				width: 100
			},{
            title: '操作人',
            dataIndex: 'operator.id',
            key: 'operator',
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
		},
	},
	form:{
		taskQueryForm: {
			submitTitle: '查询',
			items: [
				{key: 'sampleType_orders_orderNo', label: '订单编号', component: (<Input />)},
				{key: 'sampleType_serialNo', label: '样品编号', component: (<Input />)},
				{key: 'sampleType_testName', label: '样品名称', component: (<Input />)},
				{key: 'docProductTestFlow_testItem_name', label: '检测项目', component: (<Input />)},
				{key: 'docProductTestFlow_testStandard_code', label: '检测标准', component: (<Input />)},
				{key: 'docProductTestFlow_testMethod_standardNo', label: '方法标准', component: (<Input />)},
			],
		},
  },
}
export default TaskDispatchSetting;
