/**
 * 定义表格的Column配置
 *
 */
import React, {Component} from 'react';
import { Row, Col, Icon, Input, Radio, InputNumber } from 'antd';
const RadioGroup = Radio.Group;

const UnitSetting = {
	table:{
		unit:{
			key:'unit',
			name:'度量单位',
			column:[
					{
						title: '中文名称',
						dataIndex: 'name',
						key: 'name',
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
					},{
						title: '编码',
						dataIndex: 'code',
						key: 'code',
					}, {
						title: '描述',
						dataIndex: 'description',
						key: 'description',
					}, {
						title: '修改人',
						dataIndex: 'modifier',
						key: 'modifier'
					}, {
						title: '修改时间',
						dataIndex: 'modificationTime',
						key: 'modificationTime'
					}, {
						title: '安全组',
						dataIndex: 'securityGroup',
						key: 'securityGroup'
					}, {
						title: '是否审计',
						dataIndex: 'audit',
						key: 'audit',
						render: (text, record) => (
						record.audit ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
					),
					}
				],
		},
		transform:{
			key:'transform',
			name:'转换单位',
			column:[
					{
						title: '目标单位名称',
						dataIndex: 'targetUnit.name',
						key: 'objName',
					},{
						title: '转换因子',
						dataIndex: 'conversFactors',
						key: 'conversFactors',
					}, {
						title: '偏移量',
						dataIndex: 'offset',
						key: 'offset',
					}, {
						title: '自定义公式',
						dataIndex: 'costumFormula',
						key: 'costumFormula'
					}
				],
		},
	},
	form:{
		unit:{
			submitTitle: '确认',
			items: [
				{key: 'name', label: '中文名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
				{key: 'code', label: '编码', component: (<Input />), rules: [{required: true, message: '编码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '编码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'description', label: '描述', component: (<Input.TextArea />), rules: []},
				{key: 'securityGroup', label: '安全组', component: (<Input />), rules: []},
				{key: 'audit', label: '是否审记', component: (<RadioGroup>
					<Radio value="true" >已审计</Radio>
					<Radio value="false" >未审计</Radio>
				</RadioGroup>), rules: []},
			],
		},
    transform:{
			submitTitle: '确认',
			items: [
				{key: 'conversFactors', label: '转换因子', component: (<InputNumber step={0.1}/>), rules: []},
				{key: 'offset', label: '偏移量', component: (<InputNumber step={0.1}/>), rules: []},
				{key: 'costumFormula', label: '自定义公式', component: (<Input />), rules: []},
			],
		}
  },
}
export default UnitSetting;
