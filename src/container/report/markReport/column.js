import React from 'react';
import { Icon } from 'antd';
import moment from 'moment';

const MarkReportSetting = {
	table:{
		signature:{
			key:'signature',
			name:'签章',
			column:[
				{
					title: '签章',
					dataIndex: 'name',
					key: 'name',
				}
			],
		},
		reportTemplate:{
			key:'reportTemplate',
			name:'报告模板',
			column:[
				{
					title: '报告模板',
					dataIndex: 'name',
					key: 'name',
				}
			],
		},
		orderTable: {
			key:'orderTable',
			name:'订单',
			column:[
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				}, {
					title: '样品名称',
					dataIndex: 'testName',
					key: 'testName',
				}, {
					title: '样品编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
				}, {
					title: '检测项目',
					dataIndex: 'testItemName',
					key: 'testItemName',
				}, {
					title: '结果项',
					dataIndex: 'finalResult',
					key: 'finalResult',
					render: text => text || '空'
				}, {
					title: '报告结果',
					dataIndex: '',
					key: '',
					render: text => text || '空'
				}, {
					title: '是否合格',
					dataIndex: 'inSpec',
					key: 'inSpec',
					render: (text, record) => record.inSpec ? '合格' : '不合格'
				}, {
					title: '资质',
					dataIndex: 'qualificationList',
					key: 'qualificationList',
					render: (text, record) => {
						return (
							<ul>
								{(text && text.length > 0) ? text.map((_, key) => {
			            return <li key={key + ''}>{(_.signet && _.signet.name) || '空'}</li>
			          }) : '空'}
							</ul>
						)
					}
				},
			],
		},
		markReportListTable: {
			key:'markReportListTable',
			name:'样品',
			column:[
				{
					title: '订单编号',
					dataIndex: 'orders.orderNo',
					key: 'orders.orderNo',
					render: (text, record) => {
						return record.orders ? record.orders.orderNo : '空'
					}
				}, {
					title: '样品名称-编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
					render: (text, record) => {
						return (record.testName && record.serialNo) ? (record.testName +'-'+ record.serialNo) : '空'
					}
				},
			],
		},
		markReportTable: {
			key:'markReportTable',
			name:'报告列表',
			column:[
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				}, {
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
				}, {
					title: '报告模板',
					dataIndex: 'reportTemplate.name',
					key: 'reportTemplate.name',
				}, {
					title: '报告审核状态',
					dataIndex: 'process',
					key: 'process',
					render: (text, record) => {
		        return record.process || '无'
		      }
				}, {
					title: '编制时间',
					dataIndex: 'compileTime',
					key: 'compileTime',
					render: (text, record) => {
		        return moment(record.compileTime).format('YYYY-MM-DD')
		      }
				}, {
					title: '编制人',
					dataIndex: 'compile.account',
					key: 'compile.account',
					render: (text, record) => text || '空'
				}, {
					title: '签章',
					dataIndex: 'reportCompileSignet',
					key: 'reportCompileSignet',
					render: (text, record) => {
						return (
							<ul>
								{((record && record.reportCompileSignet) || []).map(_ => {
			            return <li style={{float: 'left', marginRight: '8px',}} key={_.id + ''}>{(_.signet && _.signet.name) || '空'}</li>
			          }) || '空'}
							</ul>
						)
					}
				}, {
					title: '作废',
					dataIndex: 'disable',
					key: 'disable',
					render: (text, record) => {
		        return text ?
		          <Icon type="check-circle" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
		          <Icon type="close-circle" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
		      }
				},
			],
		},
	},
}
export default MarkReportSetting;
