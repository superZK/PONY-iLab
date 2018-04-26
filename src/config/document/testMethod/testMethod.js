import React from 'react';
import { Icon, Input, Radio } from 'antd';
import BaseDataPicker from '../../../component/public/BaseDatePicker';
const RadioGroup = Radio.Group;
/**
 * 定义表格的Column配置
 *
 */
const TestMethodSetting = {
  table:{
		testMethod:{
			key:'testMethod',
			name:'检测方法',
			column:[
					{
						title: '检测方法编号',
						dataIndex: 'code',
						key: 'code',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 11,
						},
						width: 90,
					},{
						title: '标准号',
						dataIndex: 'standardNo',
						key: 'standardNo',
						width: 120,
					},{
						title: '标准名称',
						dataIndex: 'name',
						key: 'name',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 14,
						},
						width: 180,
					},{
						title: '方法中文名称',
						dataIndex: 'methodNameZH',
						key: 'methodNameZH',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						},
						width: 130,
					}, {
						title: '版本',
						dataIndex: 'version',
						key: 'version',
						width: 40,
					},{
						title: '方法标准状态',
						dataIndex: 'standardStatus',
						key: 'standardStatus',
						width: 90,
					}, {
						title: '生效日期',
						dataIndex: 'effectiveDate',
						key: 'effectiveDate',
						width: 90,
					}, {
						title: '资质类型',
						dataIndex: 'qualificationType',
						key: 'qualificationType',
						width: 70,
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
						width: 70,
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
						width: 40,
					}
				],
			expand:[
				{key:'nameEN', label:'标准英文名称'},
				{key:'nation', label:'国别'},
				{key:'methodIntro', label:'方法简介'},
				{key:'methodReplace', label:'方法替换'},
				{key:'inspectLimit', label:'方法检出限'},
				{key:'inspectLimitDesc', label:'方法检出限描述'},
				{key:'expiryDate', label:'失效日期'},
				{key:'publishUnit', label:'发布单位', longNum: 15},
				{key:'publishDate', label:'发布日期'},
				{key:'releventUnit', label:'归口单位'},
				{key:'publishNo', label:'发布号'},
				{key:'officialSource', label:'官方来源'},
				{key:'methodNameEN', label:'方法英文名称'},
			],
		},
	},
	form:{
		testMethod:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '检测方法代码', component: (<Input />), rules: [{required: true, message: '代码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '检测方法代码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'standardNo', label: '标准号', component: (<Input />), rules: []},
				{key: 'name', label: '标准名称', max: 20, component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'methodNameZH', label: '方法中文名称', component: (<Input />), rules: []},
				{key: 'inspectLimit', label: '方法检出限', component: (<Input />), rules: []},
				{key: 'standardStatus', label: '方法标准状态', component: (<Input />), rules: []},
				{key: 'effectiveDate', label: '生效日期', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'expiryDate', label: '失效日期', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'qualificationType', label: '资质类型', component: (<Input />), rules: []},
				{key: 'nameEN', label: '标准英文名称', component: (<Input />), rules: []},
				{key: 'nation', label: '国别', component: (<Input />), rules: []},
				{key: 'methodReplace', label: '方法替换', component: (<Input />), rules: []},

				{key: 'publishUnit', label: '发布单位', component: (<Input />), rules: []},
				{key: 'publishDate', label: '发布日期', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'releventUnit', label: '归口单位', component: (<Input />), rules: []},
				{key: 'publishNo', label: '发布号', component: (<Input />), rules: []},
				{key: 'officialSource', label: '官方来源', component: (<Input />), rules: []},

				{key: 'methodNameEN', label: '方法英文名称', component: (<Input />), rules: []},
				{key: 'methodIntro', label: '方法简介', component: (<Input.TextArea/>), rules: []},
				{key: 'inspectLimitDesc', label: '方法检出限描述', component: (<Input.TextArea/>), rules: []},
			],
		},
		searchForm:{
		    items: [
		      {key: 'name', label: '标准名称', component: (<Input />)},
		      {key: 'methodNameZH', label: '方法中文名称', component: (<Input />)},
		      {key: 'standardNo', label: '标准号', component: (<Input />)},
		      {key: 'synonyms', label: '名称', component: (<Input />)},
		    ]
		},
  },
}
export default TestMethodSetting;
