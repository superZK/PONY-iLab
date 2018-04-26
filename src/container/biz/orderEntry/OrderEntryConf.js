import React from 'react';
import { Input, InputNumber, Radio, Icon, Checkbox } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseDataPicker from '../../../component/public/BaseDatePicker';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const OrderEntrySetting = {
	table:{
		task:{
			key:'task',
			name:'检测任务',
			column:[
					{
						title: '检测项目名称',
						dataIndex: 'docProductTestFlow.testItem.name',
						key: 'testItemName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					},{
						title: '检测项目版本',
						dataIndex: 'docProductTestFlow.testItem.version',
						key: 'testItemVersion',
						width: 200,
					},{
						title: '检测标准号',
						dataIndex: 'docProductTestFlow.testStandard.code',
						key: 'testStandardCode',
						width: 180,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					},{
						title: '检测标准名称',
						dataIndex: 'docProductTestFlow.testStandard.name',
						key: 'testStandardName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					},{
						title: '检测标准版本',
						dataIndex: 'docProductTestFlow.testStandard.version',
						key: 'testStandardVersion',
						width: 200,
					}, {
						title: '检测方法号',
						dataIndex: 'docProductTestFlow.testMethod.standardNo',
						key: 'testMethodCode',
						width: 180,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					}, {
						title: '检测方法名称',
						dataIndex: 'docProductTestFlow.testMethod.methodNameZH',
						key: 'testMethodName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					}, {
						title: '检测方法版本',
						dataIndex: 'docProductTestFlow.testMethod.version',
						key: 'testMethodVersion',
						width: 200,
					}, {
						title: '检测项目状态',
						dataIndex: 'status',
						key: 'status',
						width: 200,
					}, {
						title: '是否合格',
						dataIndex: 'inSpec',
						width: 120,
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
						}
					}, {
						title: '禁用状态',
						dataIndex: 'disable',
						key: 'disable',
						width: 120,
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
						}
					},
				],
		},
		orderTitle:{
			key:'orderTitle',
			name:'加载订单',
			column:[
				{
					title: '订单编号',
					dataIndex: 'orderNo',
					key: 'orderNo',
				},{
					title: '委托单位',
					dataIndex: 'applicationClient',
					key: 'applicationClient',
				},{
					title: '所属组织',
					dataIndex: 'siteId',
					key: 'siteId',
				},{
					title: '申请单位',
					dataIndex: 'applicantCompany',
					key: 'applicantCompany',
				},{
					title: '受检单位',
					dataIndex: 'testCompany',
					key: 'testCompany',
				},{
					title: '销售名称',
					dataIndex: 'salesName',
					key: 'salesName',
				},{
					title: '客服名称',
					dataIndex: 'clientsService',
					key: 'clientsService',
				},{
					title: '订单金额',
					dataIndex: 'amountMoney',
					key: 'amountMoney',
				},
			],
		},
		splitSample:{
			key:'splitSample',
			name:'拆样',
			column:[
				{
					title: '样品名称',
					dataIndex: 'testName',
					key: 'testName',
				},{
					title: '检测类别',
					dataIndex: 'testType',
					key: 'testType',
				},{
					title: '存放条件',
					dataIndex: 'storageConditions',
					key: 'storageConditions',
				},{
					title: '样品状态',
					dataIndex: 'sampleStatus',
					key: 'sampleStatus',
				},{
					title: '检测环境',
					dataIndex: 'testEnvironment',
					key: 'testEnvironment',
				},{
					title: '样品规格',
					dataIndex: 'sampleSpee',
					key: 'sampleSpee',
				},{
					title: '样品类型',
					dataIndex: 'sampleType',
					key: 'sampleType',
				},
			],
		},
		productTestFlow:{
			key:'productTestFlow',
			name:'检测流程',
			column:[
				 {
						title: '检测项目',
						dataIndex: 'testItem.name',
						key: 'testItemName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '检测标准',
						dataIndex: 'testStandard.name',
						key: 'testStandardName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '检测方法标准号',
						dataIndex: 'testMethod.standardNo',
						key: 'testMethodName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '检测方法',
						dataIndex: 'testMethod.methodNameZH',
						key: 'testMethodName',
						width: 200,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '采样点',
						dataIndex: 'samplingPoint',
						key: 'samplingPoint',
						width: 80,
					},{
						title: '描述',
						dataIndex: 'description',
						key: 'description',
						width: 60,
					}, {
						title: '重复次数',
						dataIndex: 'numReplicates',
						key: 'numReplicates',
						width: 100,
					}, {
						title: '中文报告名称',
						dataIndex: 'reportedNameZH',
						key: 'reportedNameZH',
						width: 150,
					}, {
						title: '英文报告名称',
						dataIndex: 'reportedNameEN',
						key: 'reportedNameEN',
						width: 150,
					}, {
						title: '成本价格',
						dataIndex: 'costPrice',
						key: 'costPrice',
						width: 100,
					}, {
						title: '报价',
						dataIndex: 'quotePrice',
						key: 'quotePrice',
						width: 60,
					}, {
						title: '资质类型',
						dataIndex: 'qualificationType',
						key: 'qualificationType',
						width: 100,
					},
				],
		},
	},
	form:{
		orderTitle:{
			submitTitle: '暂存',
			items: [
				{key: 'orderNo', label: '订单编号', component: (<Input />), rules: [{required: true, message: '订单编号不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '订单编号只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'applicationClient', label: '委托单位', component: (<Input />), rules: [{required: true, message: '委托单位不能为空'}]},
				{key: 'siteId', label: '所属组织', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/org/site/select' />), rules: []},
				{key: 'applicantCompany', label: '申请单位', component: (<Input />), rules: []},
				{key: 'testCompany', label: '受检单位', component: (<Input />), rules: []},
				{key: 'salesName', label: '销售名称', component: (<Input />), rules: []},
				{key: 'clientsService', label: '客服名称', component: (<Input />), rules: []},
				{key: 'amountMoney', label: '订单金额', component: (<InputNumber />), rules: []},
			],
		},
		samples:{
			submitTitle: '确定',
			items: [
				{key: 'serialNo', label: '样品编号', component: (<Input />), rules: [{required: true, message: '样品编号不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '样品编号只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'productId', label: '标准产品', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={''}
						url='/doc/producttest/select' />), rules: [{required: true, message: '请选择标准产品'}]},
				{key: 'testName', label: '样品名称', component: (<Input />), rules: [{required: true, message: '检测名称不能为空'}]},
				{key: 'testType', label: '检测类别', component: (<InputNumber />), rules: []},
				{key: 'storageConditions', label: '存放条件', component: (<Input />), rules: []},
				{key: 'sampleStatus', label: '样品状态', component: (<Input />), rules: []},
				{key: 'testEnvironment', label: '检测环境', component: (<Input />), rules: []},
				{key: 'sampleingDate', label: '采样日期', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'mfgData', label: '生产日期或批号', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'tradeMark', label: '商标', component: (<Input />), rules: []},
				{key: 'sampleSpee', label: '样品规格', component: (<Input />), rules: []},
				{key: 'sampleType', label: '样品类型', component: (<InputNumber />), rules: []},
				{key: 'testLocation', label: '受检地址', component: (<Input />), rules: []},
			],
		},
		sample:{
			submitTitle: '确定',
			items: [
				{key: 'serialNo', label: '样品编号', component: (<Input />), rules: [{required: true, message: '样品编号不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '样品编号只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'productId', label: '标准产品', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={''}
						url='/doc/producttest/select' />), rules: [{required: true, message: '请选择标准产品'}]},
				{key: 'testName', label: '样品名称', component: (<Input />), rules: [{required: true, message: '检测名称不能为空'}]},
				{key: 'testType', label: '检测类别', component: (<InputNumber />), rules: []},
				{key: 'storageConditions', label: '存放条件', component: (<Input />), rules: []},
				{key: 'sampleStatus', label: '样品状态', component: (<Input />), rules: []},
				{key: 'testEnvironment', label: '检测环境', component: (<Input />), rules: []},
				{key: 'sampleingDate', label: '采样日期', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'mfgData', label: '生产日期或批号', component: (<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>), rules: []},
				{key: 'tradeMark', label: '商标', component: (<Input />), rules: []},
				{key: 'sampleSpee', label: '样品规格', component: (<Input />), rules: []},
				{key: 'sampleType', label: '样品类型', component: (<InputNumber />), rules: []},
				{key: 'zhonglei', label: '测试种类', component: (
					<RadioGroup>
		        <Radio value={1}>研发阶段</Radio>
		        <Radio value={2}>量产阶段</Radio>
						<Radio value={3}>重测</Radio>
		        <Radio value={4}>预测</Radio>
						<Radio value={5}>其他</Radio>
		      </RadioGroup>
				), rules: [{required: true, message: ''}]},
				{key: 'testLocation', label: '受检地址', component: (<Input />), rules: []},
				{key: 'baogaoxingshi', label: '报告形式', component: (
					<CheckboxGroup>
		        <Checkbox value={1}>英文报告</Checkbox>
		        <Checkbox value={2}>中文报告</Checkbox>
		      </CheckboxGroup>
				), rules: [{required: true, message: ''}]},
				{key: 'fuwu', label: '服务类型及其他', component: (
					<RadioGroup>
		        <Radio value={1}>标准服务：7-10个工作日</Radio>
		        <Radio value={2}>加急服务：5个工作日，加收100%附加费</Radio>
		      </RadioGroup>
				), rules: [{required: true, message: ''}]},
				{key: 'qubaogao', label: '取报告方式及要求', component: (
					<RadioGroup>
		        <Radio value={1}>自取</Radio>
		        <Radio value={2}>国内EMS</Radio>
						<Radio value={3}>国际EMS，收费RMB150元</Radio>
		      </RadioGroup>
				), rules: [{required: true, message: ''}]},
				{key: 'shijian', label: '大致完成时间', component: (
					<BaseDataPicker format={"YYYY-MM-DD"} placeholder={'请选择日期'}/>
				), rules: []},
				{key: 'zongfeiyong', label: '检测总费用', component: (<InputNumber />), rules: []},
				{key: 'shishou', label: '实收费用', component: (<InputNumber />), rules: []},
				{key: 'chuli', label: '样品处理', component: (
					<RadioGroup>
		        <Radio value={1}>报废</Radio>
		        <Radio value={2}>寄回（客户付费）</Radio>
						<Radio value={3}>客户领取（保留3周）</Radio>
						<Radio value={4}>样品保留一个月</Radio>
		      </RadioGroup>
				), rules: []},
			],
		},
		checkSample:{
			submitTitle: '确定',
			items: [
				{key: 'serialNo', label: '样品编号', component: (<Input />), rules: []},
				{key: 'product', label: '标准产品', component: (<Input />), rules: []},
				{key: 'testName', label: '样品名称', component: (<Input />), rules: []},
				{key: 'testType', label: '检测类别', component: (<InputNumber />), rules: []},
				{key: 'storageConditions', label: '存放条件', component: (<Input />), rules: []},
				{key: 'sampleStatus', label: '样品状态', component: (<Input />), rules: []},
				{key: 'testEnvironment', label: '检测环境', component: (<Input />), rules: []},
				{key: 'sampleingDate', label: '采样日期', component: (<Input />), rules: []},
				{key: 'mfgData', label: '生产日期或批号', component: (<Input />), rules: []},
				{key: 'tradeMark', label: '商标', component: (<Input />), rules: []},
				{key: 'sampleSpee', label: '样品规格', component: (<Input />), rules: []},
				{key: 'sampleType', label: '样品类型', component: (<InputNumber />), rules: []},
				{key: 'testLocation', label: '受检地址', component: (<Input />), rules: []},
				{key: 'disable', label: '禁用状态', component: (
				<RadioGroup name="radiogroup" >
					<Radio value={true}>禁用</Radio>
					<Radio value={false}>激活</Radio>
				</RadioGroup>), rules: []},
			],
		},
		splitSample:{
			submitTitle: '拆样',
			items: [
				{key: 'testName', label: '样品名称', component: (<Input />), rules: [{required: true, message: '检测名称不能为空'}]},
				{key: 'testType', label: '检测类别', component: (<InputNumber />), rules: []},
				{key: 'storageConditions', label: '存放条件', component: (<Input />), rules: []},
				{key: 'sampleStatus', label: '样品状态', component: (<Input />), rules: []},
				{key: 'testEnvironment', label: '检测环境', component: (<Input />), rules: []},
				{key: 'sampleSpee', label: '样品规格', component: (<Input />), rules: []},
				{key: 'sampleType', label: '样品类型', component: (<InputNumber />), rules: []},
			],
		},
		task:{
			submitTitle: '确定',
			items: [
				{key: 'inSpec', label: '是否合格', component: (
					<RadioGroup>
						<Radio value="true">是</Radio>
						<Radio value="false">否</Radio>
					</RadioGroup>), rules: []},
				{key: 'status', label: '检测项目状态', component: (<Input />), rules: [{required: true, message: '检测项目状态不能为空'}]},
			],
		},
  	},
}
export default OrderEntrySetting;
