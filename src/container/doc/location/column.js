import React from 'react';
import { Input } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import './styles.css';

const { TextArea } = Input

const LocationManageSetting = {
	table:{
		task:{
			key:'task',
			name:'位置列表',
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
					title: '编号',
					dataIndex: 'code',
					key: 'code',
				},{
					title: '名称',
					dataIndex: 'locationName',
					key: 'locationName',
					render: text => {return text || '空'}
				},{
					title: '物品类型',
					dataIndex: 'locationTypeName',
					key: 'locationTypeName',
					render: text => {return text || '空'}
				},{
					title: '描述',
					dataIndex: 'describe',
					key: 'describe',
					render: text => {return text || '空'}
				}
			],
		},
	},
	form:{
		locationForm:{
			submitTitle: '确定',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled
						lazyMode={false}
						url='/org/site/select' />
				), rules: []},
				{key: 'sid', label: '归属', component: (
					// <SearchableSelector
					// 	options={{allowClear:true}}
					// 	disabled
					// 	lazyMode={false}
					// 	url='/org/site/select' />
					<Input disabled type='text' />
				), rules: []},
				{key: 'code', label: '编号', component: (
					<Input type='text' placeholder='请输入编号' />
				), rules: [{required: true, message: '请输入编号'}]},
				{key: 'locationName', label: '名称', component: (
					<Input type='text' placeholder='请输入名称' />
				), rules: [{required: true, message: '请输入名称'}]},
				{key: 'typeId', label: '物品类型', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/loc/select' />
				), rules: [{required: true, message: '请选择物品类型'}]},
				{key: 'describe', label: '描述', component: (
					<TextArea rows={3} />
				), rules: []},
			],
		},
  },
}
export default LocationManageSetting;
