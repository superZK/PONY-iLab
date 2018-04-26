import React from 'react';
import { Input, Icon } from 'antd';
import './styles.css';
import moment from 'moment'

const { TextArea } = Input;

const ReportSentSetting = {
	table: {
		report: {
			key: 'report',
			name: '报告列表',
			column: [
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
					dataIndex: 'status',
					key: 'status',
					render: (text, record) => {
		        return record.status || '无'
		      }
				}, {
					title: '签章',
					dataIndex: 'reportCompileSignet',
					key: 'reportCompileSignet',
					render: (text, record) => {
		        return (
							<ul>
								{((record && record.reportCompileSignet) || []).map(_ => {
			            return <li>{(_.signet && _.signet.name) || '空'}</li>
			          }) || '空'}
							</ul>
						)
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
				}
			],
		},
		task: {
			key: 'task',
			name: '报告发送',
			column: [
				{
					title: '状态',
					dataIndex: 'delivery',
					key: 'delivery',
					render: (text, record) => {
						return !(record.delivery) ?
							<Icon type="check" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
							<Icon type="close" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
					}
				}, {
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
					render: text => {
						return (
							<ul>
								{(text || []).map((v, key)=> {
									return <li key={key}>{v || '空'}</li>
								})}
							</ul>
						)
					}
				}, {
					title: '样品编号',
					dataIndex: 'sampleNo',
					key: 'sampleNo',
					render: (text, record) => {
						return (
							<ul>
								{(text || []).map((v, key) => {
									return <li key={key}>{v || '空'}</li>
								})}
							</ul>
						)
					}
				}, {
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
					render: text => text || '空'
				}, {
					title: '交付物',
					dataIndex: 'reportDeliveryGoods.name',
					key: 'reportDeliveryGoods.name',
				}, {
					title: '交付方式',
					dataIndex: 'reportDeliveryMethod.name',
					key: 'reportDeliveryMethod.name'
				}, {
					title: '交付人',
					dataIndex: 'user.account',
					key: 'user.account'
				}, {
					title: '交付时间',
					dataIndex: 'deliveryTime',
					key: 'deliveryTime',
					render: (text, record) => {
						return text ? moment(text).format('YYYY-MM-DD') : '空'
					}
				}, {
					title: '取消人',
					dataIndex: 'cancel',
					key: 'cancel',
					render: (text, record) => {
						return record.cancel ? record.cancel.account : '空'
					}
				}, {
					title: '取消时间',
					dataIndex: 'cancelTime',
					key: 'cancelTime',
					render: (text, record) => {
						return text ? moment(text).format('YYYY-MM-DD') : '空'
					}
				}
			],
		},
	},
	form:{
		deliveryReport: {
			submitTitle: '确认交付',
			items: [
				{key: 'account', label: '用户名', component: (
					<Input placeholder='请输入用户名' />
				), rules: [{required: true, message: '请输入用户名'}]},
				{key: 'eseal', label: '签名密码', component: (
					<Input type='password' placeholder='请输入签名密码' />
				), rules: [{required: true, message: '请输入签名密码'}]},
				{key: 'remark', label: '备注', component: (
					<TextArea rows={3} />
				)},
			],
		},
		unDeliveryReport: {
			submitTitle: '确认取消',
			items: [
				{key: 'account', label: '用户名', component: (
					<Input placeholder='请输入用户名' />
				), rules: [{required: true, message: '请输入用户名'}]},
				{key: 'eseal', label: '签名密码', component: (
					<Input type='password' placeholder='请输入签名密码' />
				), rules: [{required: true, message: '请输入签名密码'}]},
				{key: 'remark', label: '取消原因', component: (
					<TextArea rows={3} />
				)},
			],
		},
  },
}
export default ReportSentSetting;
