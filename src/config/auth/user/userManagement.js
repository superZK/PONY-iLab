import React, {Component} from 'react';
import { Row, Col, Icon, Input } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';

const UserSetting = {
	table:{
		User:{
			key:'User',
			name:'用户管理',
			column:[
					{
						title: '账号',
						dataIndex: 'account',
						key: 'account',
					},{
						title: '姓名',
						dataIndex: 'name',
						key: 'name',
					},{
						title: '组织',
						dataIndex: 'siteName',
						key: 'siteName',
					},{
						title: '部门',
						dataIndex: 'deptName',
						key: 'deptName',
					},{
						title: '邮箱',
						dataIndex: 'email',
						key: 'email',
					},{
						title: '电话',
						dataIndex: 'tel',
						key: 'tel',
					},{
						title: '锁定状态',
						dataIndex: 'forbid',
						key: 'forbid',
						render: (text, record) => (
							record.forbid ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
						),
					},{
						title: '锁定原因',
						dataIndex: 'forbidReason',
						key: 'forbidReason',
					},{
						title: '禁用状态',
						dataIndex: 'disable',
						key: 'disable',
						render: (text, record) => (
							record.disable ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
						),
					},
				],
		},
	},
	form:{
		AddEditUser:{
			submitTitle: '确认',
			items: [
				{key: 'siteId', label: '组织', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />
				), rules: []},
				{key: 'deptId', label: '部门', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />
				), rules: []},
				{key: 'account', label: '账号', component: (<Input />), rules: [{required: true, message: '账号不能为空'}, {pattern: '^[a-zA-Z0-9]+$',message: '账号只能由字母、数字组成' }]},
				{key: 'name', label: '姓名', component: (<Input />), rules: [{required: true, message: '姓名不能为空'}]},
				{key: 'email', label: '邮箱', component: (<Input />), rules: [{pattern: '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+',message: '请输入正确的邮箱' }]},
				{key: 'tel', label: '电话', component: (<Input />), rules: []},
			],
		},
		ForbidUser:{
			submitTitle: '确认',
			items: [{key: 'forbidReason', label: '锁定原因', component: (<Input.TextArea />), rules: [{required: true, message: '锁定原因不能为空'}]}],
		}
  },
}
export default UserSetting;
