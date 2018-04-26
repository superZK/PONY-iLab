/**
 * 定义表格的Column配置
 *
 */
import React from 'react';
import { Input } from 'antd';

const UserMenuSetting = {
	table:{},
	form:{
		modifyPassword:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '原密码', component: (<Input />), rules: [{required: true, message: '原密码不能为空'},]},
				{key: 'name', label: '新密码', component: (<Input />), rules: [{required: true, message: '新密码不能为空'},]},
				{key: 'nameEN', label: '新密码确认', component: (<Input />), rules: [{required: true, message: '请确认新密码'},]},
			],
		}
  },
}
export default UserMenuSetting;