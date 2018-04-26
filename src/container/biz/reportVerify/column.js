import React from 'react';
import { Input, Icon, } from 'antd';
import BaseRadio from '../../../component/public/BaseRadio';
import moment from 'moment';

const ReportVerifySetting = {
  table: {
    orders:{
			key:'orders',
			name:'订单',
			column:[
					{
						title: '订单编号',
						dataIndex: 'orderNo',
						key: 'orderNo',
            render: (text, record) => {
              return text || record.name || '空'
            }
					},
          {
						title: '样品编号-名称',
						dataIndex: 'serialNo',
						key: 'serialNo',
            render: (text, record) => {
              return (text + '-' + record.testName) || '空'
            }
					},
				],
		},
    ordersList:{
			key:'ordersList',
			name:'订单列表',
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
            render: (text) => {
              return (text !== null) ? '待审' : '空'
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
						dataIndex: 'compile',
						key: 'compile',
            render: (text, record) => text ? text.account : '空'
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
					},
				],
		},
    sampleVerify:{
		key:'sampleVerify',
		name:'订单审核',
		column:[
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				},{
					title: '样品编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
          render: (text, record) => {
            return (
              <ul>
                {record.reportCompileResult && record.reportCompileResult.length !== 0 && (record.reportCompileResult).map(item => {
                  return <li key={item.id}>{item && item.sampleType && item.sampleType.serialNo}</li>
                })}
              </ul>
            )
          }
				},{
					title: '样品名称',
					dataIndex: 'testName',
					key: 'testName',
          render: (text, record) => {
            return (
              <ul>
                {record.reportCompileResult && record.reportCompileResult.length !== 0 && (record.reportCompileResult).map(item => {
                  return <li key={item.id}>{item && item.sampleType && item.sampleType.testName}</li>
                })}
              </ul>
            )
          }
				},{
					title: '是否合格',
					dataIndex: '',
					key: '',
          render: text => text || '空'
				},{
					title: '是否加急',
					dataIndex: '',
					key: '',
          render: text => text || '空'
				}
			],
	  },
  },
  form: {
	loginForm:{
		submitTitle: '登录',
		items: [
			{key: 'userName', label: '用户名', component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />), rules: [{required: true, message: '请输入用户名'}]},
			{key: 'signaturePassword', label: '签名密码', component: (<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />), rules: [{required: true, message: '请输入签名密码'}]},
		],
	},
	infoForm:{
		submitTitle: '确定',
		items: [
			{key: 'verifyType', label: '审批', component: (
				<BaseRadio
				data = {[{label:'通过', value:'2'},{label:'退回', value:'3'}]}
				/>), rules: [{required: true, message: '请选择审批结果'}]},
			{key: 'memo', label: '审核意见', component: (<Input.TextArea autosize={{minRows: 4, maxRows: 4}} />), rules: [{}]},
		],
	},
  }
}
export default ReportVerifySetting;
