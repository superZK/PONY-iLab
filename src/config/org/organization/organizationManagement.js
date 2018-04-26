import React, {Component} from 'react';
import { Input } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
/**
 * 定义表格的Column配置
 */
const OrganizationSetting = {
	table:{
		Organization:{
			key:'Organization',
			name:'组织管理',
			column:[
						{
						title: '编号',
						dataIndex: 'code',
						key: 'code',
					}, {
						title: '组织名称',
						dataIndex: 'name',
						key: 'name'
					}, {
						title: '地区',
						dataIndex: 'areaName',
						key: 'areaName'
					}, {
						title: '地址一',
						dataIndex: 'address1',
						key: 'address1'
					}, {
						title: '地址二',
						dataIndex: 'address2',
						key: 'address2'
					}, {
						title: '地址三',
						dataIndex: 'address3',
						key: 'address3'
					}, {
						title: '邮编',
						dataIndex: 'postcode',
						key: 'postcode'
					}, {
						title: '电话',
						dataIndex: 'tel',
						key: 'tel'
					}, {
						title: '传真',
						dataIndex: 'fax',
						key: 'fax'
					},
				],
		},
	},
	form:{
		Organization: {
			submitTitle: '确认',
			items: [
				{key: 'areaId', label: '地区', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/categories/select/1008' />), rules: []},
				{key: 'code', label: '代码', component: (<Input />), rules: [{required: true, message: '代码不能为空'}, {pattern: '^[a-zA-Z0-9._/-]+$',message: '编码只能由字母、数字、“.”、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '组织名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'address1', label: '地址一', component: (<Input />), rules: []},
				{key: 'address2', label: '地址二', component: (<Input />), rules: []},
				{key: 'address3', label: '地址三', component: (<Input />), rules: []},
				{key: 'postcode', label: '邮编', component: (<Input />), rules: [{pattern: '^\\d{6}$', message: '请填写正确的邮编' }]},
				{key: 'tel', label: '电话', component: (<Input />), rules: []},
				{key: 'fax', label: '传真', component: (<Input />), rules: []},
			],
		},
  },
}
export default OrganizationSetting;