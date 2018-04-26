/**
 * 定义表格的Column配置
 *
 */
const PrivilegeGrantSetting = {
	table: {
		privilegeTable:{
			key:'privilegeTable',
			name:'权限点表格',
			column:[
	      {
	        title: '权限编号',
	        dataIndex: 'code',
	        key: 'code',
	      }, {
	        title: '权限名称',
	        dataIndex: 'name',
	        key: 'name',
	      }, {
	        title: '权限描述',
	        dataIndex: 'description',
	        key: 'description',
	      },
	    ],
		},
	}
}
export default PrivilegeGrantSetting;
