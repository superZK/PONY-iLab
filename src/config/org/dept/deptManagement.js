import React, {Component} from 'react';
import { Input } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
/**
 * 定义表格的Column配置
 *
 */
const DeptSetting = {
	table:{
		Dept:{
			key:'Dept',
			name:'部门管理',
			column:[
					{
						title: '编号',
						dataIndex: 'code',
						key: 'code',
					}, {
						title: '部门名称',
						dataIndex: 'name',
						key: 'name'
					}, {
						title: '组织名称',
						dataIndex: 'siteName',
						key: 'siteName'
					}, {
						title: '部门类型',
						dataIndex: 'deptTypeName',
						key: 'deptTypeName'
					}, {
						title: '服务组',
						dataIndex: 'serviceGroupName',
						key: 'serviceGroupName'	
					},
				],
		},
	},
	form:{
		Dept: {
			submitTitle: '确认',
			items: [
				{key: 'deptTypeId', label: '部门类型', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/categories/select/1014' />), rules: []},
				{key: 'serviceGroupId', label: '服务组', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/categories/select/1009' />), rules: []},
				{key: 'code', label: '编号', component: (<Input />), rules: [{required: true, message: '编号不能为空'}, { pattern: '^[a-zA-Z0-9._/-]+$', message: '编号代码只能由字母、数字、“.”、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '部门名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
			],
		},
  },
}
export default DeptSetting;