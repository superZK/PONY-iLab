import React from 'react';
import { Input, Icon } from 'antd';
import './styles.css';

const ReportTemplateManageSetting = {
	table:{
		task:{
			key:'task',
			name:'报告模板',
			column:[
				{
					title: '名字',
					dataIndex: 'name',
					key: 'name',
				},{
					title: '是否禁用',
					dataIndex: 'activation',
					key: 'activation',
					render: (text, record) => {
						return record.activation ?
							<Icon type="check-circle" style={{fontSize: 16, color : '#00A854', textAlign: 'center'}} /> :
							<Icon type="close-circle" style={{fontSize: 16, color : '#F04134', textAlign: 'center'}} />
					}
				}
			],
		}, upload:{
			key:'upload',
			name:'上传文件列表',
			column:[
				{
					title: '文件名称',
					dataIndex: 'name',
					key: 'name',
				}, {
					title: '是否主文件',
					dataIndex: 'major',
					key: 'major',
					render: (text, record) => {
						return text ?
						<Icon type="check-circle-o" style={{fontSize: 16, color : '#00A854'}} /> :
						<Icon type="close-circle-o" style={{fontSize: 16, color : '#F04134'}} />
					}
				}
			],
		}
	},
	form:{
		reportTemplate:{
			submitTitle: '确定',
			items: [
				{key: 'name', label: '报告模板名称', component: (
					<Input type='text' placeholder='请输入报告模板名称' />
				), rules: [{required: true, message: '请输入报告模板名称'}]},
			],
		},
  },
}
export default ReportTemplateManageSetting;
