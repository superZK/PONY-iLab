import React from 'react';
import { Input, Icon, } from 'antd';
import BaseRadio from '../../../component/public/BaseRadio';
import BaseRangePicker from '../../../component/public/BaseRangePicker';
import moment from 'moment';

const ReportVerifySetting = {
  table: {
    offer:{
			key:'offer',
			name:'报价单',
			column:[
				{
					title: '单据编号',
					dataIndex: 'code',
					key: 'code',
				}, {
					title: '客户名称',
					dataIndex: 'customer',
					key: 'customer',
				}, {
					title: '总价',
					dataIndex: 'total',
					key: 'total',
				}, {
					title: '折扣',
					dataIndex: 'discount',
					key: 'discount',
				}, {
					title: '折后价',
					dataIndex: '',
					key: '',
				}, {
					title: '制单日期',
					dataIndex: 'cts',
					key: 'cts',
				}
			],
		},
    offer_s:{
			key:'offer_s',
			name:'报价单详情',
			column:[
				{
					title: '产品',
					dataIndex: '',
					key: '',
				}, {
					title: '方案',
					dataIndex: '',
					key: '',
				}, {
					title: '等级',
					dataIndex: '',
					key: '',
				}, {
					title: '检验项目',
					dataIndex: '',
					key: '',
				}, {
					title: '检验标准',
					dataIndex: '',
					key: '',
				}, {
					title: '检验方法',
					dataIndex: '',
					key: '',
				}, {
					title: '检验次数',
					dataIndex: '',
					key: '',
				}, {
					title: '单价',
					dataIndex: '',
					key: '',
				}, {
					title: '折扣',
					dataIndex: '',
					key: '',
				}, {
					title: '折后价',
					dataIndex: '',
					key: '',
				}
			],
		},
    addOffer:{
		key:'addOffer',
		name:'新增列表',
		column:[
				{
					title: '检测项目',
					dataIndex: '',
					key: '',
				},{
					title: '方法标准号',
					dataIndex: '',
					key: '',
				},{
					title: '方法标准名称',
					dataIndex: '',
					key: '',
				},{
					title: '方法名称',
					dataIndex: '',
					key: '',
				},{
					title: '单价',
					dataIndex: '',
					key: '',
				},{
					title: '数量',
					dataIndex: '',
					key: '',
				},{
					title: '总价',
					dataIndex: '',
					key: '',
				},{
					title: '折扣',
					dataIndex: '',
					key: '',
				},{
					title: '折扣价',
					dataIndex: '',
					key: '',
				}
			],
	  },
    addItemOffer:{
		key:'addItemOffer',
		name:'新增报价单项目',
		column:[
				{
					title: '检测项目名称',
					dataIndex: 'testItem.name',
					key: 'testItem.name',
				},{
					title: '方法标准号',
					dataIndex: 'testMethod.standardNo',
					key: 'testMethod.standardNo',
				},{
					title: '方法标准名称',
					dataIndex: 'testMethod.name',
					key: 'testMethod.name',
				},{
					title: '方法名称',
					dataIndex: 'testMethod.methodNameZH',
					key: 'testMethod.methodNameZH',
				},{
					title: '单价',
					dataIndex: 'quotePrice',
					key: 'quotePrice',
				},{
					title: '分组',
					dataIndex: '',
					key: '',
				}
			],
	  },
  },
  form: {
  	addForm:{
  		submitTitle: '搜索',
  		items: [
  			{key: 'num', label: '单据编号', component: (<Input placeholder="请输入客户名称" />), rules: []},
        {key: 'name', label: '客户名称', component: (<Input placeholder="请输入客户名称" />), rules: []},
  		],
  	},
    addsForm:{
  		submitTitle: '搜索',
  		items: [
  			{key: 'number', label: '总价', component: (<Input style={{float: 'left'}} />), rules: []},
        {key: 'date', label: '折扣(%)', component: (<Input />), rules: []},
        {key: 'jia', label: '折后价', component: (<Input />), rules: []},
  		],
  	},
  	addItemForm:{
  		submitTitle: '搜索',
  		items: [
  			{key: 'product', label: '产品名称', component: (
          <Input placeholder='请输入产品名称' />
  			), rules: [{required: true, message: '请输入产品名称'}]},
  			{key: 'memo', label: '方案名称', component: (<Input placeholder='请输入方案名称' />), rules: [{}]},
        {key: 'xianmgu', label: '检测项目', component: (<Input placeholder='请输入检测项目' />), rules: [{}]},
        {key: 'fangfa', label: '检测方法', component: (<Input placeholder='请输入检测方法' />), rules: [{}]},
  		],
  	},
  }
}
export default ReportVerifySetting;
