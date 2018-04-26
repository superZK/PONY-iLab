/**
 * 定义表格的Column配置
 *
 */
import React from 'react';
import { Input } from 'antd';

const CategorySetting = {
	table:{
		category:{
			key:'category',
			name:'类别管理',
			column:[
					{
						title: '',
						dataIndex: 'icons',
						key: 'icons',
						width: 30,
						render: (text, record) => {
							if(record.subordinate && record.subordinate.length > 0){
								return <span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span>;
							}
							return <span className="glyphicon glyphicon-file" aria-hidden="true"></span>;
						}
					},{
						title: '编码',
						dataIndex: 'code',
						key: 'code',
					}, {
						title: '名称',
						dataIndex: 'name',
						key: 'name'
					}, {
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN'
					}
				],
		},
	},
	form:{
		category:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '编码', component: (<Input />), rules: [{required: true, message: '编码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '编码代码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
			],
		}
  },
}
export default CategorySetting;
