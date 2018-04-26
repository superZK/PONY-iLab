import React from 'react';
import { Input, Select } from 'antd';
import BaseRangePicker from "../../../component/public/BaseRangePicker";

const Option = Select.Option;

const ReportQuerySetting = {
	table: {
    reports:{
			key:'reports',
			name:'报告列表',
			column:[
				{
					title: '所属组织',
					dataIndex: 'siteName',
					key: 'siteName',
					render: (text, record) => {
						return (
							<ul>
								{record.snapshot && record.snapshot.length > 0 && (record.snapshot).map(v => {
									return v.ordersSnapshot && v.ordersSnapshot.length > 0 && (v.ordersSnapshot).map(item => {
										return <li key={item.id}>{(item && item.site && item.site.name) || '空'}</li>
									})
								})}
							</ul>
						)
					}
				}, {
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
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
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
				}, {
					title: '报告模板',
					dataIndex: 'reportTemplate.name',
					key: 'reportTemplate.name'
				}, {
					title: '编制人',
					dataIndex: 'compile.name',
					key: 'compile.name'
				}, {
					title: '编制日期',
					dataIndex: 'compileTime',
					key: 'compileTime'
				}
			],
    },
		reportTasks:{
			key:'reportTasks',
			name:'报告审核任务分配',
			column:[
				{
					title: '序号',
					dataIndex: 'sn',
					key: 'sn',
				}, {
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				}, {
					title: '客户名称',
					dataIndex: 'snapshot[0].ordersSnapshot[0].applicationClient',
					key: 'snapshot[0].ordersSnapshot[0].applicationClient',
				}, {
					title: '报告编号',
					dataIndex: 'reportNo',
					key: 'reportNo',
				}, {
					title: '报告模板',
					dataIndex: 'reportTemplate.name',
					key: 'reportTemplate.name',
					render: text => {return text || '空'}
				},
			],
    },
	},
	form:{
		queryConditions: {
			submitTitle: '查询',
			items: [
				{
          key: 'commonConditions',
          label: '常用条件',
          component: (
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="常用条件">
              <Option value="1">待调度</Option>
              <Option value="2">待提交</Option>
              <Option value="3">审核中</Option>
              <Option value="4">待交付</Option>
              <Option value="5">已交付</Option>
							<Option value="6">已归档</Option>
            </Select>
          ),
        },
        {
          key: 'dateType',
          label: '期间类型',
          component: (
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="期间类型">
							<Option value="1">编制日期</Option>
							<Option value="2">流程开始日期</Option>
              <Option value="3">流程结束日期</Option>
              <Option value="4">交付日期</Option>
							<Option value="5">归档日期</Option>
            </Select>
          ),
          rules: [
            {required: true, message: '请输入查询期间类型'}
          ]
        },
        {
          key: 'dateRange',
          label: '期间',
          component: (<BaseRangePicker />),
          rules: [
            {required: true, message: '请输入查询期间'}
          ]
        },
        {
          key: 'keyWord',
          label: '关键字',
          component: (<Input placeholder='订单编号、报告编号、报告模板、客户名称' />),
        },
			],
		},
  },
}
export default ReportQuerySetting;
