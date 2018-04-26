import React from 'react';
import { Icon, Input, Badge } from 'antd';
import SearchableSelector from '../../component/public/SearchableSelector';
import BaseRangePicker from "../../component/public/BaseRangePicker";
/**
 * 定义表格的Column配置
 *
 */
const TestUISetting = {
    tableExample:{
		key:'testItem',
		name:'检测项目',
		column:[
				{
					title: '检测项目编码',
					dataIndex: 'code',
					key: 'code',
				},{
					title: '检测项目名称',
					dataIndex: 'name',
					key: 'name',
				},{
					title: '单位',
					dataIndex: 'measunit',
					key: 'measunit',
				},{
					title: '英文名称',
					dataIndex: 'nameEN',
					key: 'nameEN',
				},{
	        title: '版本号',
	        dataIndex: 'version',
	        key: 'version',
	      }, {
	        title: '显示名称',
	        dataIndex: 'showName',
	        key: 'showName'
	      }, {
	        title: '别名',
	        dataIndex: 'alias',
	        key: 'alias'
	      }, {
	        title: '激活标志',
	        dataIndex: 'activation',
	        key: 'activation',
	        render: (text, record) => (
	        record.activation ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
	      ),
	      }, {
	        title: '自动审核通过',
	        dataIndex: 'autoCheckPass',
	        key: 'autoCheckPass',
	        render: (text, record) => (
	        record.autoCheckPass ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
	      ),
	      }, {
	        title: '自动审核拒绝',
	        dataIndex: 'autoCheckRefuse',
	        key: 'autoCheckRefuse',
	        render: (text, record) => (
	        record.autoCheckRefuse ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
	      ),
	      }
	    ],
      expand: [
        {key:'description', label:'描述'},
        {key:'reportName', label:'报告名称'},
        {key:'instrumentGroup', label:'仪器组'},
        {key:'instrumentNumber', label:'仪器编号'},
        {key:'lab', label:'实验室'},
        {key:'testSite', label:'检测地点'},
        {key:'saveondition', label:'存储条件'},
        {key:'destructiveness', label:'是否具有破坏性'},
      ],
	},
	complexTable:{
		key:'testItem',
		name:'检测项目',
		column:[
      {
        title: '序号',
        dataIndex: 'SerialNumber',
        width: 100,
        fixed: 'left',
      },
      {
        title: 'Full Name',
        dataIndex: 'name',
        width: 200,
        fixed: 'left',
        needCellClick: true,
        needAdvancedRender: true,
        renderType: '可编辑',
        render: {
          editingMethod: '文本',
          max: 10,
          min: 0,
          editControlRule: ['status'],
          editControl: (status) => {
            switch(status){
              case '待审核':
                return true;
              case '已审核':
                return false;
              default:
                return true;
            }
          },
          url: '/biz/order/report/resultsFile/select',
          urlParameter: {
            resultFileId: 'resultFileId',
            FileId: 'resultFileId',
            leId: 'resultFileId',
          },
        }
      },
      {
        title: 'Age',
        dataIndex: 'age',
				width: 100,
				className: 'table-right',
      },
      {
        title: '长内容',
        dataIndex: 'longTitle',
        needAdvancedRender: true,
        renderType: '文字提示',
        render: {
          spanClass: {color: 'red'},
          mouseEnterDelay: 2,
          longNum: 10,
        }
      },
      {
        title: '激活状态',
        dataIndex: 'active',
        width: 100,
        needAdvancedRender: true,
        renderType: '图标',
        render: {
          showIconRule:(value) => {
            switch(value){
              case true:
                return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>
              case false:
                return (<Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>);
            }
          }
        }
      },
      {
        title: '状态点',
        dataIndex: 'status',
        width: 100,
        // fixed: 'right',
        needAdvancedRender: true,
        renderType: '状态点',
        render: {
          processRule:(status) => {
            switch(status){
              case '已完成':
                return (<Badge status="success" text="已完成" />);
              default:
                return (<Badge status="error" text="错误" />);
            }
          }
        }
      },
    ],
	},
  	formExample:{
	    submitTitle: 'Let\'s GO!',
	    items: [
	      {key: 'code', label: '检测项目编码', component: (<Input />), rules: [{required: true, message: '编号不能为空'},]},
	      {key: 'name', label: '检测项目名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'},]},
	      {key: 'measunit', label: '单位', component: (
	        <SearchableSelector
	          options={{allowClear:true}}
	          disabled={false}
	          lazyMode={false}
	          url='/doc/measunit/select' />
	      ), rules: [{required: true, message: '测试ref不能为空'},]},
	    ]
		},
		queryForm: {
			submitTitle: '查询',
			items: [
				{key: 'siteName', label: '组织', component: (<Input />)},
				{key: 'orderNo', label: '订单编号', component: (<Input />)},
				{key: 'clientName', label: '客户名称', component: (<Input />)},
				{key: 'siteId', label: '状态', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />), rules: []},
				{key: 'date', label: '时间段', component: (<BaseRangePicker />), rules: []},
			],
		},
}
export default TestUISetting;
