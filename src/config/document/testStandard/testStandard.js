/**
 * 定义表格的Column配置
 *
 */
import React from 'react';
import { Icon, Input } from 'antd';
import BaseDataPicker from '../../../component/public/BaseDatePicker';

const TestStandardSetting = {
  table:{
		testStandard:{
			key:'testStandard',
			name:'检测标准',
			column:[
					{
						title: '检测标准编号',
						dataIndex: 'code',
						key: 'code',
						width: 120,
					},{
						title: '检测标准名称',
						dataIndex: 'name',
						key: 'name',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						},
						width: 170,
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 11,
						},
						width: 100,
					}, {
						title: '版本',
						dataIndex: 'version',
						key: 'version',
						width: 50,
					}, {
						title: '标准替换',
						dataIndex: 'standardReplace',
						key: 'standardReplace',
						width: 120,
					}, {
						title: '标准简介',
						dataIndex: 'standardIntro',
						key: 'standardIntro',
						width: 100,
					}, {
						title: '资质类型',
						dataIndex: 'qualificationType',
						key: 'qualificationType',
						width: 100,
					}, {
						title: '生效日期',
						dataIndex: 'effectiveDate',
						key: 'effectiveDate',
						width: 80,
					}, {
						title: '失效日期',
						dataIndex: 'expiryDate',
						key: 'expiryDate',
						width: 80,
					}, {
						title: '激活状态',
						dataIndex: 'activation',
						key: 'activation',
						width: 100,
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
					}, {
						title: '废弃',
						dataIndex: 'discard',
						key: 'discard',
						width: 100,
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
					}
				],
			expand:[
				{key:'nation', label:'国别'},
				{key:'publishUnit', label:'发布单位', longNum:15},
				{key:'publishDate', label:'发布日期'},
				{key:'releventUnit', label:'归口单位'},
				{key:'publishNo', label:'发布号'},
				{key:'officialSource', label:'官方来源'},
				{key:'icsclass', label:'ICS分类'},
			],
		},
	},
	form:{
		testStandard:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '检测标准代码', component: (<Input />), rules: [{required: true, message: '代码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '检测标准代码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '检测标准名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
				{key: 'publishDate', label: '发布日期', component: (<BaseDataPicker format="YYYY-MM-DD" placeholder={'请选择日期'}/>), rules: []},
				{key: 'effectiveDate', label: '生效日期', component: (<BaseDataPicker format="YYYY-MM-DD" placeholder={'请选择日期'}/>), rules: []},
				{key: 'expiryDate', label: '失效日期', component: (<BaseDataPicker format="YYYY-MM-DD" placeholder={'请选择日期'}/>), rules: []},
				{key: 'standardReplace', label: '标准替换', component: (<Input />), rules: []},
				{key: 'qualificationType', label: '资质类型', component: (<Input />), rules: []},
				{key: 'nation', label: '国别', component: (<Input />), rules: []},
				{key: 'publishUnit', label: '发布单位', component: (<Input />), rules: []},
				{key: 'releventUnit', label: '归口单位', component: (<Input />), rules: []},
				{key: 'publishNo', label: '发布号', component: (<Input />), rules: []},
				{key: 'officialSource', label: '官方来源', component: (<Input />), rules: []},
				{key: 'icsclass', label: 'ICS分类', component: (<Input />), rules: []},
				{key: 'standardIntro', label: '标准简介', component: (<Input.TextArea/>), rules: []},
			],
		},
		searchForm:{
		    items: [
		      {key: 'name', label: '名称', component: (<Input />)},
		      {key: 'standardReplace', label: '标准替换', component: (<Input />)},
		    ]
		},
	}
}
export default TestStandardSetting;
