import React from 'react';
import { Input, } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import moment from 'moment';

const ReportVerifySetting = {
  table: {
    store: {
			key: 'store',
			name: '库存管理',
			column: [
				{
					title: '物料编号',
					dataIndex: 'code',
					key: 'code',
				}, {
					title: '物料名称',
					dataIndex: 'name',
					key: 'name',
				}, {
					title: '厂商',
					dataIndex: 'vendor',
					key: 'vendor',
				}, {
					title: '规格',
					dataIndex: 'spec',
					key: 'spec',
				}
			],
		},
    materialStore: {
		key: 'materialStore',
		name: '物料入库',
		column: [
				{
					title: '物料编号',
					dataIndex: 'info.code',
					key: 'info.code',
				}, {
					title: '物料名称',
					dataIndex: 'info.name',
					key: 'info.name',
				}, {
					title: '批号',
					dataIndex: 'batchNo',
					key: 'batchNo',
				}, {
					title: '质控号',
					dataIndex: 'qualityNo',
					key: 'qualityNo',
				}, {
					title: '计量单位',
					dataIndex: 'measUnit.name',
					key: 'measUnit.name',
				}, {
					title: '单位数量',
					dataIndex: 'unitNumber',
					key: 'unitNumber',
				}, {
					title: '存放位置',
					dataIndex: 'storageLocation.name',
					key: 'storageLocation.name',
				}, {
					title: '入库日期',
					dataIndex: 'storageDate',
					key: 'storageDate',
          render: text => {return moment(text).format('YYYY-MM-DD')}
				}
			],
	  },
    purchaseNote: {
		key: 'purchaseNote',
		name: '采购单',
		column: [
				{
					title: '物料编号',
					dataIndex: 'info.code',
					key: 'info.code',
				}, {
					title: '物料名称',
					dataIndex: 'info.name',
					key: 'info.name',
				}, {
					title: '批号',
					dataIndex: 'batchNo',
					key: 'batchNo',
				}, {
					title: '厂商',
					dataIndex: 'vendor',
					key: 'vendor',
				}, {
					title: '规格',
					dataIndex: 'spec',
					key: 'spec',
				}, {
					title: '待入数量',
					dataIndex: '',
					key: '',
				}
			],
	  },
    standingBook: {
		key: 'standingBook',
		name: '物料台帐',
		column: [
				{
					title: '时间',
					dataIndex: '',
					key: '',
				}, {
					title: '业务类型',
					dataIndex: '',
					key: '',
				}, {
					title: '度量单位',
					dataIndex: '',
					key: '',
				}, {
					title: '当前结余',
					dataIndex: '',
					key: '',
				}, {
					title: '数量',
					dataIndex: '',
					key: '',
				}, {
					title: '应结余',
					dataIndex: '',
					key: '',
				}, {
					title: '实际结余',
					dataIndex: '',
					key: '',
				}
			],
	  },
  },
  form: {
  	materalInfoForm:{
  		submitTitle: '物料信息',
  		items: [
  			{key: 'code', label: '物料编号', component: (<Input placeholder="物料编号" />), rules: [{required: true, message: '请输入物料编号'}]},
        {key: 'name', label: '物料名称', component: (<Input placeholder="物料名称" />), rules: [{required: true, message: '请输入物料名称'}]},
        {key: 'unitId', label: '计量单位', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/doc/measunit/select' />
        ), rules: [{required: true, message: '请选择计量单位'}]},
        {key: 'batchNo', label: '批号', component: (<Input placeholder="批号" />), rules: [{required: true, message: '请输入批号'}]},
        {key: 'qualityNo', label: '质控号', component: (<Input />)},
        {key: 'unitNumber', label: '单位数量', component: (<Input />)},
  		],
  	},
    materalReceiveForm:{
  		submitTitle: '领用信息',
  		items: [
  			{key: 'receiveDept', label: '领用部门', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/org/site/select' />
        ), rules: [{required: true, message: '请选择领用部门'}]},
        {key: 'receiveUser', label: '领用人', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/auth/user/select' />
        ), rules: [{required: true, message: '请选择领用人'}]},
        {key: 'dosage', label: '用途', component: (<Input placeholder="用途" />), rules: [{required: true, message: '请输入用途'}]},
        {key: 'remainBefore', label: '当前余量', component: (<Input />)},
  		],
  	},
    materalReturnForm:{
  		submitTitle: '归还信息',
  		items: [
  			{key: 'bumen', label: '归还部门', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/org/site/select' />
        ), rules: [{required: true, message: '请选择归还部门'}]},
        {key: 'lingyongren', label: '归还人', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/auth/user/select' />
        ), rules: [{required: true, message: '请选择归还人'}]},
        {key: 'cost', label: '用量', component: (<Input placeholder="用途" />), rules: [{required: true, message: '请输入用途'}]},
        {key: 'remainAfter', label: '余量', component: (<Input />)},
  		],
  	},
    purchaseNoteForm:{
  		submitTitle: '采购单信息',
  		items: [
  			{key: 'bumen', label: '订单编号', component: (
          <Input placeholder="订单编号" />
        ), rules: [{required: true, message: '请选择归还部门'}]},
        {key: 'lingyongren', label: '供应商', component: (
          <SearchableSelector
            options={{allowClear:true}}
            disabled={false}
            lazyMode={false}
            url='/loc/select' />
        )},
        {key: 'yongtu', label: '订单日期', component: (<Input placeholder="用途" />)},
        {key: 'yuliang', label: '经手人', component: (<Input />)},
  		],
  	},
  }
}
export default ReportVerifySetting;
