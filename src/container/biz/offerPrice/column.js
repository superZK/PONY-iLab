import React from 'react';
import { Input, InputNumber, Icon } from 'antd';

const { TextArea } = Input;

const OfferPriceSetting = {
  table: {
    offerPriceList:{
			key:'offerPriceList',
			name:'订单',
			column:[
					{
						title: '检测项目名称',
						dataIndex: 'item.name',
						key: 'item.name',
					}, {
						title: '方法标准号',
						dataIndex: 'method.standardNo',
						key: '',
					}, {
						title: '方法标准名称',
						dataIndex: 'method.name',
						key: '',
					}, {
						title: '方法名称',
						dataIndex: '',
						key: '',
					}, {
						title: '单价',
						dataIndex: 'price',
						key: 'price',
					}, {
						title: '分组',
						dataIndex: 'group',
						key: 'group',
					}, {
						title: '激活',
						dataIndex: 'disable',
						key: 'disable',
						needAdvancedRender: true,
						renderType: '图标',
						render: {
							showIconRule: (value) => {
								switch(value){
									case true:
										return <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/>;
									case false:
										return <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />;
								}
							}
						},
						width: 45,
					}, {
						title: '备注',
						dataIndex: 'memo',
						key: 'memo',
					},
				],
		},
  },
  form: {
    addOfferPriceForm: {
      submitTitle: '确认',
  		items: [
        {key: 'qewr', label: '单价', component: (<Input style={{visibility: 'hidden'}} />), rules: []},
        {key: 'daef', label: '单价', component: (<Input style={{visibility: 'hidden'}} />)},
        {key: 'price', label: '单价', component: (<InputNumber />), rules: [{required: true, message: ''}]},
        {key: 'group', label: '分组', component: (<Input placeholder="" />), rules: [{required: true, message: ''}]},
        {key: 'memo', label: '备注', component: (<TextArea rows={3} />), rules: []},
  		],
    }
  }
}
export default OfferPriceSetting;
