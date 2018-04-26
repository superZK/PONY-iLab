import React from 'react';
import { Input } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';


const DeptTaskSetting = {
	table:{
		task:{
			key:'task',
			name:'报告模板',
			column:[
				{
					title: '产品',
					dataIndex: 'productName',
					key: 'productName',
					render: (text, record) => {
						return (record.productTest && record.productTest.product && record.productTest.product.name) || '空'
					}
				}, {
					title: '方案',
					dataIndex: 'testPlanName',
					key: 'testPlanName',
					render: (text, record) => {
						return (record.productTest && record.productTest.testPlan && record.productTest.testPlan.name) || '空'
					}
				}, {
					title: '等级',
					dataIndex: 'productGradeName',
					key: 'productGradeName',
					render: (text, record) => {
						return (record.productTest && record.productTest.productGrade && record.productTest.productGrade.name) || '空'
					}
				}, {
					title: '项目',
					dataIndex: 'testItemName',
					key: 'testItemName',
					render: (text, record) => {
						return (record.testItem && record.testItem.name) || '空'
					}
				}, {
					title: '分类',
					dataIndex: '',
					key: '',
				}, {
					title: '产品标准号',
					dataIndex: 'testStandardCode',
					key: 'testStandardCode',
					render: (text, record) => {
						return (record.testStandard && record.testStandard.code) || '空'
					}
				}, {
					title: '方法标准号',
					dataIndex: 'standardNo',
					key: 'standardNo',
					render: (text, record) => {
						return (record.testMethod && record.testMethod.standardNo) || '空'
					}
				}, {
					title: '方法',
					dataIndex: 'methodNameZH',
					key: 'methodNameZH',
					render: (text, record) => {
						return (record.testMethod && record.testMethod.methodNameZH) || '空'
					}
				},
			],
		},
		addDeptTask:{
			key:'add',
			name:'检测项目选取',
			column:[
				{
					title: '产品',
					dataIndex: 'productTest.product.name',
					key: 'productTest.product.name',
					fixed: 'left',
					width: 150,
					render: (text, record) => {
						return (record.productTest && record.productTest.product && record.productTest.product.name) || '空'
					}
				}, {
					title: '项目',
					dataIndex: 'testItem.name',
					key: 'testItem.name',
					width: 130,
					render: (text, record) => {
						return (record.testItem && record.testItem.name) || '空'
					}
				}, {
					title: '产品标准号',
					dataIndex: 'testStandard.code',
					key: 'testStandard.code',
					width: 140,
					render: (text, record) => {
						return (record.testStandard && record.testStandard.code) || '空'
					}
				}, {
					title: '产品标准名称',
					dataIndex: 'testStandard.name',
					key: 'testStandard.name',
					width: 220,
					render: (text, record) => {
						return (record.testStandard && record.testStandard.name) || '空'
					}
				}, {
					title: '方法标准号',
					dataIndex: 'testMethod.standardNo',
					key: 'testMethod.standardNo',
					width: 140,
					render: (text, record) => {
						return (record.testMethod && record.testMethod.standardNo) || '空'
					}
				}, {
					title: '方法标准名称',
					dataIndex: 'testMethod.name',
					key: 'testMethod.name',
					width: 280,
					render: (text, record) => {
						return (record.testMethod && record.testMethod.name) || '空'
					}
				}, {
					title: '方案',
					dataIndex: 'productTest.testPlan.name',
					key: 'productTest.testPlan.name',
					// fixed: 'left',
					width: 100,
					render: (text, record) => {
						return (record.productTest && record.productTest.testPlan && record.productTest.testPlan.name) || '空'
					}
				}, {
					title: '等级',
					dataIndex: 'productTest.productGrade.name',
					key: 'productTest.productGrade.name',
					width: 100,
					render: (text, record) => {
						return (record.productTest && record.productTest.productGrade && record.productTest.productGrade.name) || '空'
					}
				}, {
					title: '方法',
					dataIndex: 'testMethod.methodNameZH',
					key: 'testMethod.methodNameZH',
					fixed: 'right',
					width: 140,
					render: (text, record) => {
						return (record.testMethod && record.testMethod.methodNameZH) || '空'
					}
				},
			],
		},
		formExample: {
	    submitTitle: 'Let\'s GO!',
	    items: [
	      {key: 'code', label: '检测项目编码', component: (<Input />), rules: [{required: true, message: '编号不能为空'},]},
	      {key: 'name', label: '检测项目名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'},]},
	      {key: 'measunit', label: '单位', component: (
	        <SearchableSelector
	          options={{allowClear:true}}
	          disabled={false}
	          lazyMode={false}
	          url='/doc/measunit/select' />
	      ), rules: [{required: true, message: '测试ref不能为空'},]},
	    ]
		},
	},
	form:{
		reportTemplate:{
			submitTitle: '确定',
			items: [
				{key: 'name', label: '报告模板名称', component: (
					<Input type='text' placeholder='请输入报告模板名称' />
				), rules: [{required: true, message: '请输入报告模板名称'}]},
			],
		},
  },
}
export default DeptTaskSetting;
