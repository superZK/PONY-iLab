import moment from 'moment';

const ReportVerifySetting = {
  table: {
    material:{
			key:'material',
			name:'物料',
			column:[
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
    materialPart:{
  		key:'materialPart',
  		name:'物料入库',
  		column:[
        {
					title: '订单编号',
					dataIndex: 'ordNo',
					key: 'ordNo',
				}, {
					title: '物料编号',
					dataIndex: 'info.code',
					key: 'info.code',
				}, {
					title: '物料名称',
					dataIndex: 'info.name',
					key: 'info.name',
				},{
					title: '批号',
					dataIndex: 'batchNo',
					key: 'batchNo',
				},{
					title: '质控号',
					dataIndex: 'qualityNo',
					key: 'qualityNo',
				},{
					title: '计量单位',
					dataIndex: 'measUnit.name',
					key: 'measUnit.name',
				},{
					title: '单位数量',
					dataIndex: 'unitNumber',
					key: 'unitNumber',
				},{
					title: '存放位置',
					dataIndex: 'storageLocation.name',
					key: 'storageLocation.name',
				},{
					title: '入库日期',
					dataIndex: 'storageDate',
					key: 'storageDate',
          render: text => {return moment(text).format('YYYY-MM-DD')}
				}
			],
	  },
  },
}
export default ReportVerifySetting;
