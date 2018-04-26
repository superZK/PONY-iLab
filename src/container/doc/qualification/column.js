import React from 'react';
import { Input, Icon } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseCheckbox from '../../../component/public/BaseCheckbox';
import BaseRadio from '../../../component/public/BaseRadio';
import BaseDatePicker from '../../../component/public/BaseDatePicker';
import './styles.css';
import moment from 'moment';

const Search = Input.Search;

const QualificationManageSetting = {
	table:{
		task:{
			key:'task',
			name:'检测任务',
			column:[
					{
						title: '组织',
						dataIndex: 'dept.site.name',
						key: 'dept.site.name',
					},{
						title: '部门',
						dataIndex: 'dept.name',
						key: 'dept.name',
					},{
						title: '资质',
						dataIndex: 'qualificationType.name',
						key: 'qualificationType.name',
					},{
						title: '检验方法',
						dataIndex: 'testMethodName',
						key: 'testMethodName',
					},{
						title: '检验方法标准号',
						dataIndex: 'testMethodStandardNo',
						key: 'testMethodStandardNo',
					},{
						title: '检验项目',
						dataIndex: 'testItemName',
						key: 'testItemName',
					}, {
						title: '检验产品',
						dataIndex: 'ProductName',
						key: 'ProductName',
						render: (text, record) => {
							return text || '空'
						}
					}, {
						title: '生效日期',
						dataIndex: 'effectDate',
						key: 'effectDate',
						render: text => text ? moment(text).format('YYYY-MM-DD') : '空'
					}, {
						title: '终止日期',
						dataIndex: 'expiryDate',
						key: 'expiryDate',
						render: text => text ? moment(text).format('YYYY-MM-DD') : '空'
					}, {
						title: '是否禁用',
						dataIndex: 'activation',
						key: 'activation',
						className: 'column-money',
						render: (text, record) => {
							return record.activation ?
								<Icon type="check-circle" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
								<Icon type="close-circle" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
						}
					},
				],
		},
		addQualify: {
			key: 'addQualify',
			name: '添加资质',
			column: [
				{
					title: '检测项目',
					dataIndex: 'testItem.name',
					key: 'testItem.name',
					render: (text, record) => {
						return record.testItem ? record.testItem.name : '空'
					}
				}, {
					title: '检测方法标准号',
					dataIndex: 'testMethod.standardNo',
					key: 'testMethod.standardNo',
					render: (text, record) => {
						return record.testMethod ? record.testMethod.standardNo : '空'
					}
				}, {
					title: '检测方法标准名称',
					dataIndex: 'testMethod.name',
					key: 'testMethod.name',
					render: (text, record) => {
						return record.testMethod ? record.testMethod.name : '空'
					}
				}, {
					title: '产品标准号',
					dataIndex: 'testStandard.code',
					key: 'testStandard.code',
					render: (text, record) => {
						return record.testStandard ? record.testStandard.code : '空'
					}
				}, {
					title: '产品标准名称',
					dataIndex: 'testStandard.name',
					key: 'testStandard.name',
					render: (text, record) => {
						return record.testStandard ? record.testStandard.name : '空'
					}
				}
			]
		},
		connectProduct: {
			key: 'connectProduct',
			name: '关联产品',
			column: [
				{
					title: '产品',
					dataIndex: 'name',
					key: 'name'
				},
			]
		},
	},
	form:{
		qualifyTitle:{
			submitTitle: '搜索',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />
				), rules: [{ message: '请选择组织'}]},
				{key: 'siteId', label: '部门', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />
				), rules: [{ message: '请选择部门'}]},
				{key: 'qualificationTypeId', label: '资质', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/categories/select/1017' />
				), rules: [{message: '请选择资质'}]},
				{key: 'testMethodId', label: '检验方法', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/testmethod/select' />), rules: []},
				{key: 'testItemId', label: '检验项目', component: (
					<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={false}
					url='/doc/testitem/select' />), rules: []},
				{key: 'productId', label: '检验产品', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/product/select' />), rules: []},
				// {key: 'activation', label: '是否禁用', component: (
				// 	<Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
				// ), rules: []},
			],
		},
		addQualify: {
			submitTitle: '搜索',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={false}
						lazyMode={false}
						placeholder='请选择组织'
						url='/org/site/select' />
				), rules: [{required: true, message: '请选择组织'}]},
				{key: 'siteId', label: '部门', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={false}
						lazyMode={false}
						placeholder='请选择部门'
						url='/org/site/select' />
				), rules: [{required: true, message: '请选择部门'}]},
				{key: 'qualificationTypeId', label: '资质', component: (
					<BaseCheckbox url='/doc/categories/type/1017' />
				), rules: [{required: true}]},
				{key: 'effectDate', label: '生效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择生效日期'}/>), rules: []},
				{key: 'expiryDate', label: '失效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择失效日期'}/>), rules: []},
				{key: 's', label: '关键字', component: (
					<Search
						placeholder="请输入关键字查询资质"
					/>
				), rules: [{required: true, message: '请输入关键字进行查询'}]}
			],
		},
		editQualify: {
			submitTitle: '确定',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={false}
						lazyMode={false}
						placeholder='请选择组织'
						url='/org/site/select' />
				), rules: [{required: true, message: '请选择组织'}]},
				{key: 'siteId', label: '部门', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={false}
						lazyMode={false}
						placeholder='请选择部门'
						url='/org/site/select' />
				), rules: [{required: true, message: '请选择部门'}]},
				{key: 'qualificationTypeId', label: '资质', component: (
					// <BaseCheckbox url='/doc/categories/type/1017' />
					  <BaseRadio
							disabled={true}
							needRequestData={true}
							url='/doc/categories/type/1017'
						/>
						// <BaseCheckbox disabled url='/doc/categories/type/1017' />
				), rules: [{required: true}]},
				{key: 'testItemId', label: '检验项目', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={true}
						lazyMode={false}
						placeholder='请选择检验项目'
						url='/doc/testitem/select' />
				), rules: [{required: true, message: '请选择检验项目'}]},
				{key: 'testMethodId', label: '检验方法', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled={true}
						lazyMode={false}
						placeholder='请选择检验方法'
						url='/doc/testmethod/select' />
				), rules: [{required: true, message: '请选择检验方法'}]},
				{key: 'effectDate', label: '生效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择生效日期'}/>), rules: [{required: true, message: '请选择生效日期'}]},
				{key: 'expiryDate', label: '失效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择失效日期'}/>), rules: [{required: true, message: '请选择失效日期'}]},
			],
		},
		connectProductDis: {
			submitTitle: '搜索',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled
						lazyMode={false}
						placeholder='请选择组织'
						url='/org/site/select' />
				), rules: []},
				{key: 'deptId', label: '部门', component: (
					<SearchableSelector
						options={{allowClear: true}}
						disabled
						lazyMode={false}
						placeholder='请选择部门'
						url='/org/site/select' />
				), rules: []},
				{key: 'qualificationTypeId', label: '资质', component: (
					<BaseCheckbox disabled url='/doc/categories/type/1017' />
				), rules: []},
				{key: 'testMethodId', label: '检验方法', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={true}
						lazyMode={false}
						url='/doc/testmethod/select' />), rules: []},
				{key: 'testItemId', label: '检验项目', component: (
					<SearchableSelector
					options={{allowClear:true}}
					disabled
					lazyMode={false}
					url='/doc/testitem/select' />), rules: []},
			],
		},
		connectProduct: {
			submitTitle: '搜索',
			items: [
				{key: 'effectDate', label: '生效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择生效日期'}/>), rules: [{required: true, message: '请选择生效日期'}]},
				{key: 'expiryDate', label: '失效日期', component: (<BaseDatePicker format={"YYYY-MM-DD"} placeholder={'请选择失效日期'}/>), rules: [{required: true, message: '请选择失效日期'}]},
			],
		},
  },
}
export default QualificationManageSetting;
