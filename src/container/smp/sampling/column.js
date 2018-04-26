import React from 'react';
import { Input, Icon } from 'antd';
import BaseDatePicker from '../../../component/public/BaseDatePicker';
import BaseRangePicker from "../../../component/public/BaseRangePicker";

const Search = Input.Search;

const SampleManagementSetting = {
	table:{
		task:{
			key:'task',
			name:'报告模板',
			column:[
				{
					title: '抽样单编号',
					dataIndex: 'code',
					key: 'code',
				}, {
					title: '抽样地点',
					dataIndex: 'address',
					key: 'address',
				}, {
					title: '抽样基数',
					dataIndex: 'base',
					key: 'base',
				}, {
					title: '被抽样单位',
					dataIndex: 'entityUnder',
					key: 'entityUnder',
				}, {
					title: '被抽样单位电话',
					dataIndex: 'entityUnderPhone',
					key: 'entityUnderPhone',
				}, {
					title: '被抽样单位区域',
					dataIndex: 'entityUnderDistrict',
					key: 'entityUnderDistrict',
				}, {
					title: '抽样单位',
					dataIndex: 'entity',
					key: 'entity',
				}, {
					title: '抽样人',
					dataIndex: 'operateBy',
					key: 'operateBy',
				}, {
					title: '抽样日期',
					dataIndex: 'operateDate',
					key: 'operateDate',
					// needAdvancedRender: false,
					// render: (text) => {
					// 	console.log(text);
					// 	return moment(text, 'YYYY-MM-DD') || '空'
					// }
				}, {
					title: '是否禁用',
					dataIndex: 'available',
					key: 'available',
					needAdvancedRender: true,
					renderType: '图标',
					render: {
						showIconRule: (value) => {
							switch(value){
								case true:
									return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}}/>;
								case false:
									return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />;
							}
						}
					}
				}
			],
		},
	},
	form:{
		filterForm: {
			submitTitle: '查询',
			items: [
				{key: 'sampledDate', label: '日期', component: (
					<BaseRangePicker />
				), rules: [{required: true, message: '请选择日期'}]},
				{key: 'key', label: '关键字', component: (
					<Search placeholder="请输入关键字查询资质" />
				)},
			]
		},
		samplingForm:{
			submitTitle: '确定',
			items: [
				{key: 'code', label: '抽样单编号', component: (
					<Input type='text' placeholder='请输入抽样单编号' />
				), rules: [{required: true, message: '请输入抽样单编号'}]},
				{key: 'address', label: '抽样单地点', component: (
					<Input type='text' placeholder='请输入抽样单地点' />
				), rules: [{required: true, message: '请输入抽样单地点'}]},
				{key: 'base', label: '抽样基数', component: (
					<Input type='text' placeholder='请输入抽样基数' />
				), rules: [{required: true, message: '请输入抽样基数'}]},
				{key: 'operateBy', label: '抽样人', component: (
					<Input type='text' placeholder='请输入抽样人' />
				), rules: [{required: true, message: '请输入抽样人'}]},
				{key: 'operateDate', label: '抽样日期', component: (
					<BaseDatePicker format={"YYYY-MM-DD"} placeholder='请选择抽样日期' />
				), rules: [{required: true, message: '请选择抽样日期'}]},
				{key: 'entityUnder', label: '被抽样单位', component: (
					<Input type='text' placeholder='请输入被抽样单位' />
				), rules: [{required: true, message: '请输入被抽样单位'}]},
				{key: 'entityUnderPhone', label: '被抽样单位电话', component: (
					<Input type='text' placeholder='请输入被抽样单位电话' />
				), rules: [{required: true, message: '请输入被抽样单位电话'}]},
				{key: 'entityUnderDistrict', label: '被抽样单位区域', component: (
					<Input type='text' placeholder='请输入被抽样单位区域' />
				), rules: [{required: true, message: '请输入被抽样单位区域'}]},
				{key: 'entity', label: '抽样单位', component: (
					<Input type='text' placeholder='请输入抽样单位' />
				), rules: [{required: true, message: '请输入抽样单位'}]},
			],
		},
  },
}
export default SampleManagementSetting;
