import React from 'react';
import { Icon } from 'antd';
import './styles.css';
import moment from 'moment';

const ReportArchivedSetting = {
	table:{
		task:{
			key:'task',
			name:'未归档报告',
			column:[
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				}, {
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
				}, {
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
				}, {
					title: '客户名称',
					dataIndex: 'applicationClient',
					key: 'applicationClient',
					render: (text, record) => {
						return (
							<ul>
								{record.snapshot && record.snapshot.length > 0 && (record.snapshot).map(v => {
									return v.ordersSnapshot && v.ordersSnapshot.length > 0 && (v.ordersSnapshot).map(item => {
										return <li key={item.id}>{item.applicationClient || '空'}</li>
									})
								})}
							</ul>
						)
					}
				}, {
					title: '归档人',
					dataIndex: 'archiveBy',
					key: 'archiveBy',
					render: text => text ? text.account : '空'
				}, {
					title: '归档分类',
					dataIndex: 'reportContainerType',
					key: 'reportContainerType',
					render: (text, record) => record.reportContainerType ? record.reportContainerType.name : '空'
				}, {
					title: '归档位置',
					dataIndex: 'location',
					key: 'location',
					render: text => text ? text.name : '空'
				}, {
					title: '归档时间',
					dataIndex: 'archiveDate',
					key: 'archiveDate',
					render: (text, record) => {
						return text ? moment(text).format('YYYY-MM-DD') : '空'
					}
				}
			],
		},
		archive:{
			key:'archive',
			name:'报告归档',
			column:[
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					render: (text, record) => {
						return (record.location === null || record.location === undefined || record.location === '') ?
							<Icon type="check" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
							<Icon type="close" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
					}
				}, {
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				}, {
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
				}, {
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
					render: text => text || '空'
				}, {
					title: '客户名称',
					dataIndex: 'applicationClient',
					key: 'applicationClient',
					render: (text, record) => {
						return (
							<ul>
								{record.snapshot && record.snapshot.length > 0 && (record.snapshot).map(v => {
									return v.ordersSnapshot && v.ordersSnapshot.length > 0 && (v.ordersSnapshot).map(item => {
										return <li key={item.id}>{item.applicationClient || '空'}</li>
									})
								})}
							</ul>
						)
					}
				}, {
					title: '归档位置',
					dataIndex: 'location',
					key: 'location',
					render: text => text ? text.name : '空'
				}
			],
		},
	},
}
export default ReportArchivedSetting;
