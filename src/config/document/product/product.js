import React from 'react';
import { Icon, Input, InputNumber, Radio } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import BaseRadio from '../../../component/public/BaseRadio';
import AdvancedSelect from '../../../component/public/Reference/AdvancedSelect';
const RadioGroup = Radio.Group;

const testStandardSelect = {
	key: 'testStandardSelect',
	name: '检测标准下拉选择',
	column:[
		{
			title: '检测标准编号',
			dataIndex: 'code',
			key: 'code',
			width: 60,
		},{
			title: '检测标准名称',
			dataIndex: 'name',
			key: 'name',
			width: 60,
			needAdvancedRender: true,
			renderType: '文字提示',
			render: {
				mouseEnterDelay: 0.5,
				longNum: 30,
			}
		}
	],
};

const testMethodSelect = {
	key: 'testItemSelect',
	name: '检测方法下拉选择',
	column:[
		{
			title: '标准号',
			dataIndex: 'standardNo',
			key: 'standardNo',
			width: 60,
		},{
			title: '方法中文名称',
			dataIndex: 'methodNameZH',
			key: 'methodNameZH',
			width: 60,
			needAdvancedRender: true,
			renderType: '文字提示',
			render: {
				mouseEnterDelay: 0.5,
				longNum: 30,
			}
		},{
			title: '标准名称',
			dataIndex: 'name',
			key: 'name',
			width: 60,
			needAdvancedRender: true,
			renderType: '文字提示',
			render: {
				mouseEnterDelay: 0.5,
				longNum: 30,
			}
		},
	],
};

const ProductSetting = {
	table:{
		product:{
			key:'product',
			name:'产品质量',
			column:[
					{
						title: '产品代码',
						dataIndex: 'code',
						key: 'code',
						width: 110,
					},{
						title: '产品名称',
						dataIndex: 'name',
						key: 'name',
						width: 273,
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
						width: 108,
					}, {
						title: '版本',
						dataIndex: 'version',
						key: 'version',
						width: 81,
					}, {
						title: '描述',
						dataIndex: 'description',
						key: 'description',
						width: 199,
					}, {
						title: '检测单名称',
						dataIndex: 'testInvoicesName',
						key: 'testInvoicesName',
						width: 149,
					}, {
						title: '同义词',
						dataIndex: 'synonyms',
						key: 'synonyms',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						},
						width: 200,
					}, {
						title: '安全组',
						dataIndex: 'secuityGroup',
						key: 'secuityGroup',
						width: 101,
					}, {
						title: '激活状态',
						dataIndex: 'activation',
						key: 'activation',
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
						width: 91,
					}, {
						title: '是否删除',
						dataIndex: 'remove',
						key: 'remove',
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
						width: 90,
					},
				],
		},
		testProgram:{
			key:'testProgram',
			name:'检测方案',
			column:[
				 {
						title: '检测方案',
						dataIndex: 'testPlan.name',
						key: 'testPlan.name',
					}, {
						title: '产品等级',
						dataIndex: 'productGrade.name',
						key: 'productGrade.name',
					}, {
						title: '采样点',
						dataIndex: 'samplingSite',
						key: 'samplingSite',
						render: text => text ||'空'
					}, {
						title: '描述',
						dataIndex: 'description',
						key: 'description',
						render: text => text ||'空'
					}, {
						title: '检测单名称',
						dataIndex: 'testInvoicesName',
						key: 'testInvoicesName',
						render: text => text ||'空'
					}, {
						title: '是否总是判定',
						dataIndex: 'alwaysDecide',
						key: 'alwaysDecide',
						render: (text, record) => (
						record.alwaysDecide ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
					),
					}, {
						title: '是否继续判定',
						dataIndex: 'continueDecide',
						key: 'continueDecide',
						render: (text, record) => (
						record.continueDecide ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/>
					),
					}
				],
		},
		productTestFlow:{
			key:'productTestFlow',
			name:'产品质量检测项目',
			column:[
				  {
						title: '检测项目',
						dataIndex: 'testItem.name',
						key: 'testItem.name',
						width: 250,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 15,
						}
					},{
						title: '产品标准号',
						dataIndex: 'testStandard.code',
						key: 'testStandard.code',
						width: 200.7,
					},{
						title: '产品标准名称',
						dataIndex: 'testStandard.name',
						key: 'testStandard.name',
						width: 211,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						}
					},{
						title: '检测方法标准号',
						dataIndex: 'testMethod.standardNo',
						key: 'testMethod.standardNo',
						width: 202,
					},{
						title: '检测方法标准名称',
						dataIndex: 'testMethod.name',
						key: 'testMethod.name',
						width: 250,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '检测方法',
						dataIndex: 'testMethod.methodNameZH',
						key: 'testMethod.methodNameZH',
						width: 250,
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 12,
						}
					},{
						title: '服务组',
						dataIndex: 'serviceGroup.name',
						key: 'serviceGroup.name',
						width: 100,
					},
				],
				expand:[
					// {key:'testMethodInspectLimit', label:'方法检出限'},
					{key:'reportedNameZH', label:'中文报告名称'},
					{key:'reportedNameEN', label:'英文报告名称'},
					{key:'samplingPoint', label:'采样点'},
					{key:'numReplicates', label:'重复次数'},
					{key:'description', label:'描述'},
					{key:'costPrice', label:'成本价格'},
					{key:'quotePrice', label:'报价'},
					{key:'requiredVolume', label:'检测用量'},
					{key:'measUnit.name', label:'检测用量单位'},
					{key:'testInterval', label:'检测用时'},
				],
		},
		resultRecordStandard:{
			key:'resultRecordStandard',
			name:'产品质量检测项目结果项',
			column:[
					{
						title: '名称',
						dataIndex: 'name',
						key: 'name',
						width: 60,
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
						width: 120,
					},{
						title: '报告名称',
						dataIndex: 'reportName',
						key: 'reportName',
						width: 120,
					},{
						title: '英文报告名称',
						dataIndex: 'reportNameEN',
						key: 'reportNameEN',
						width: 180,
					},{
						title: '顺序号',
						dataIndex: 'orderNumber',
						key: 'orderNumber',
						width: 90,
					},{
						title: '修约规则',
						dataIndex: 'roundRule.name',
						key: 'roundRuleName',
						width: 120,
					},{
						title: '判定规则',
						dataIndex: 'specRule',
						width: 120,
						key: 'specRule',
					},{
						title: '采样点',
						dataIndex: 'samplingSite',
						key: 'samplingSite',
						width: 90,
					},{
						title: '结果类型',
						dataIndex: 'resultType.name',
						key: 'resultName',
						width: 120,
					},{
						title: '结果项档案',
						dataIndex: 'resultsFile.name',
						key: 'resultsFileName',
						width: 150,
					},{
						title: '最大值',
						dataIndex: 'max',
						key: 'max',
						width: 90,
					},{
						title: '最小值',
						dataIndex: 'min',
						key: 'min',
						width: 90,
					},{
						title: '计量单位',
						dataIndex: 'measureUnit.name',
						key: 'measUnitName',
						width: 120,
					},{
						title: '重复次数',
						dataIndex: 'numReplicates',
						key: 'numReplicates',
						width: 120,
					}, {
						title: '指标范围',
						dataIndex: 'indexScope',
						key: 'indexScope',
						width: 120,
					},{
						title: '报告项',
						dataIndex: 'showOnCoa',
						key: 'showOnCoa',
						render: (text, record) => (
							record.showOnCoa ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}} />
						),
						width: 60,
					}
				],
			expand:[
				{key:'description', label:'描述'},
				{key:'descriptionEN', label:'英文描述'},
				{key:'places', label:'修约小数位数'},
				{key:'lowControl1', label:'低控限制1'},
				{key:'lowControl2', label:'低控限制2'},
				{key:'lowControl3', label:'低控限制3'},
				{key:'lowControl4', label:'低控限制4'},
				{key:'lowControl5', label:'低控限制5'},
				{key:'highControl1', label:'高控限制1'},
				{key:'highControl2', label:'高控限制2'},
				{key:'highControl3', label:'高控限制3'},
				{key:'highControl4', label:'高控限制4'},
				{key:'highControl5', label:'高控限制5'},
			],
		},
	},
	form:{
		product:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '产品代码', component: (<Input />), rules: [{required: true, message: '产品代码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '产品代码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '产品名称', component: (<Input />), rules: [{required: true, message: '产品名称不能为空'}]},
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
				{key: 'testInvoicesName', label: '检测单名称', component: (<Input />), rules: []},
				{key: 'secuityGroup', label: '安全组', component: (<Input />), rules: []},
				{key: 'synonyms', label: '同义词', component: (<Input />), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
				{key: 'remove', label: '是否删除', component: (
				<BaseRadio
					data = {[{label:'是', value:true},{label:'否', value:false}]}
				/>), rules: []},
			],
		},
		testProgram:{
			submitTitle: '确认',
			items: [
				{key: 'testPlanId', label: '检测方案', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/categories/select/1013' />), rules: [{required: true, message: '检测方案不能为空'}]},
				{key: 'productGradeId', label: '检测等级', component: (
				<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={false}
					url='/doc/categories/select/1012' />), rules: [{required: true, message: '检测等级不能为空'}]},
				{key: 'samplingSite', label: '采样点', component: (<Input />), rules: []},
				{key: 'testInvoicesName', label: '检测单名称', component: (<Input />), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea style={{height: 145}}/>), rules: []},
				{key: 'continueDecide', label: '是否继续判定', component: (
				<BaseRadio
					data = {[{label:'是', value:'true'},{label:'否', value:'false'}]}
				/>), rules: []},
				{key: 'alwaysDecide', label: '是否总是判定', component: (
				<BaseRadio
					data = {[{label:'是', value:'true'},{label:'否', value:'false'}]}
				/>), rules: []},
			],
		},
		productTestFlow:{
			submitTitle: '确认',
			items: [
				{key: 'testMethod.id', label: '检测方法', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						renderKey={['entity.standardNo', 'name']}
						url='/doc/testmethod/select' />), rules: [],
						formItemColStyle:'formItem-col-extra'
					},
				// {key: 'testMethod.id', label: '检测方法', component: (
				// 	<AdvancedSelect
				// 		value={['0']}
				// 		transferKey={'key'}
				// 		renderKey={['standardNo', 'methodNameZH', 'name']}
				// 		inputWidth={200}
				// 		dropDownWidth={654}
				// 		setting={testMethodSelect}
				// 		url={'/doc/testmethod/select'}
				// 	/>), rules: [],
				// 		formItemColStyle:'formItem-col-extra'
				// 	},
				{key: 'testStandard.id', label: '检测标准', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						renderKey={['code', 'name']}
						defaultValue={'0'}
						url='/doc/teststandard/select' />), rules: [],
						formItemColStyle:'formItem-col-extra'
					},
				// {key: 'testStandard.id', label: '检测标准', component: (
				// 	<AdvancedSelect
				// 		value={['0']}
				// 		transferKey={'key'}
				// 		renderKey={['code', 'name']}
				// 		inputWidth={200}
				// 		dropDownWidth={654}
				// 		setting={testStandardSelect}
				// 		url={'/doc/teststandard/select'}
				// 	/>), rules: [],
				// 		formItemColStyle:'formItem-col-extra'
				// 	},
				{key: 'testItem.id', label: '检测项目', component: (
				<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={true}
					defaultValue={'0'}
					url='/doc/testitem/select' />), rules: [{required: true, message: '检测项目不能为空'}]},
				{key: 'serviceGroup.id', label: '服务组', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						url='/doc/categories/select/1009' />), rules: []},
				{key: 'measUnit.id', label: '检测用量单位', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						url='/doc/measunit/select' />), rules: []},
				{key: 'reportedNameZH', label: '中文报告名称', component: (<Input />), rules: []},
				{key: 'reportedNameEN', label: '英文报告名称', component: (<Input />), rules: []},
				{key: 'samplingPoint', label: '采样点', component: (<Input />), rules: []},
				{key: 'numReplicates', label: '重复次数', component: (<InputNumber/>), rules: []},
				{key: 'costPrice', label: '成本价格', component: (<InputNumber precision={2} />), rules: []},
				{key: 'quotePrice', label: '报价', component: (<InputNumber precision={2} />), rules: []},
				{key: 'requiredVolume', label: '检测用量', component: (<Input />), rules: []},
				{key: 'testInterval', label: '检测用时', component: (<InputNumber />), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
			],
		},
		productTestItem:{
			submitTitle: '确认',
			items: [
				{key: 'testMethod.id', label: '检测方法', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						renderKey={['entity.standardNo', 'name']}
						url='/doc/testmethod/select' />), rules: [],
						formItemColStyle:'formItem-col-extra'
					},
				{key: 'testStandard.id', label: '检测标准', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						renderKey={['code', 'name']}
						url='/doc/teststandard/select' />), rules: [],
						formItemColStyle:'formItem-col-extra'
					},
				{key: 'testItem.id', label: '检测项目', component: (
				<SearchableSelector
					options={{allowClear:true}}
					disabled={true}
					lazyMode={true}
					defaultValue={'0'}
					url='/doc/testitem/select' />),
					rules: [{required: true, message: '检测项目不能为空'}]},
				{key: 'serviceGroup.id', label: '服务组', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						url='/doc/categories/select/1009' />), rules: []},
				{key: 'measUnit.id', label: '检测用量单位', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={true}
						defaultValue={'0'}
						url='/doc/measunit/select' />), rules: []},
				{key: 'reportedNameZH', label: '中文报告名称', component: (<Input />), rules: []},
				{key: 'reportedNameEN', label: '英文报告名称', component: (<Input />), rules: []},
				{key: 'samplingPoint', label: '采样点', component: (<Input />), rules: []},
				{key: 'numReplicates', label: '重复次数', component: (<InputNumber/>), rules: []},
				{key: 'costPrice', label: '成本价格', component: (<InputNumber precision={2} />), rules: []},
				{key: 'quotePrice', label: '报价', component: (<InputNumber precision={2} />), rules: []},
				{key: 'requiredVolume', label: '检测用量', component: (<Input />), rules: []},
				{key: 'testInterval', label: '检测用时', component: (<InputNumber />), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
			],
		},
		resultRecordStandard: {
			submitTitle: '确认',
			items: [
				{key: 'name', label: '名称', component: (<Input/>), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'resultType.id', label: '结果类型', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/resultType/select' />), rules: [{required: true, message: '结果类型不能为空'}]},
				{key: 'resultsFile.id', label: '结果项档案', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/resultsFile/select' />), rules: []},
				{key: 'measureUnit.id', label: '度量单位', component: (
				<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={false}
					url='/doc/measunit/select' />), rules: []},
				{key: 'roundRule.id', label: '修约规则', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/roundRule/select' />), rules: []},
				{key: 'nameEN', label: '英文名称', component: (<Input/>), rules: []},
				{key: 'reportName', label: '报告名称', component: (<Input/>), rules: []},
				{key: 'reportNameEN', label: '英文报告名称', component: (<Input/>), rules: []},
				{key: 'samplingSite', label: '采样点', component: (<Input/>), rules: []},
				{key: 'orderNumber', label: '顺序号', component: (<InputNumber/>), rules: []},
				{key: 'numReplicates', label: '重复次数', component: (<InputNumber/>), rules: []},
				{key: 'max', label: '最大值', component: (<InputNumber/>), rules: []},
				{key: 'min', label: '最小值', component: (<InputNumber/>), rules: []},
				{key: 'indexScope', label: '指标范围', component: (<Input/>), rules: []},
				{key: 'places', label: '修约小数位数', component: (<InputNumber/>), rules: []},
				{key: 'lowControl1', label: '低控限制1', component: (<Input/>), rules: []},
				{key: 'lowControl2', label: '低控限制2', component: (<Input/>), rules: []},
				{key: 'lowControl3', label: '低控限制3', component: (<Input/>), rules: []},
				{key: 'lowControl4', label: '低控限制4', component: (<Input/>), rules: []},
				{key: 'lowControl5', label: '低控限制5', component: (<Input/>), rules: []},
				{key: 'highControl1', label: '高控限制1', component: (<Input/>), rules: []},
				{key: 'highControl2', label: '高控限制2', component: (<Input/>), rules: []},
				{key: 'highControl3', label: '高控限制3', component: (<Input/>), rules: []},
				{key: 'highControl4', label: '高控限制4', component: (<Input/>), rules: []},
				{key: 'highControl5', label: '高控限制5', component: (<Input/>), rules: []},
				{key: 'specRule', label: '判定规则', component: (<Input/>), rules: []},
				{key: 'showOnCoa', label: '是否是报告项', component: (
				<BaseRadio
					data = {[{label:'是', value:'1'},{label:'否', value:'2'}]}
				/>), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
				{key: 'descriptionEN', label: '英文描述', component: (<Input.TextArea/>), rules: []},
			],

		},
		resultScopeRecord: {
			submitTitle: '确认',
			items: [
				{key: 'name', label: '名称', component: (<Input/>), rules: [{required: true, message: '名称不能为空'}]},
				{key: 'resultType.id', label: '结果类型', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/resultType/select' />), rules: [{required: true, message: '结果类型不能为空'}]},
				{key: 'resultsFile.id', label: '结果项档案', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/resultsFile/select' />), rules: []},
				{key: 'measureUnit.id', label: '度量单位', component: (
				<SearchableSelector
					options={{allowClear:true}}
					disabled={false}
					lazyMode={false}
					url='/doc/measunit/select' />), rules: []},
				{key: 'roundRule.id', label: '修约规则', component: (
					<SearchableSelector
						options={{allowClear:true}}
						disabled={false}
						lazyMode={false}
						url='/doc/resultrecord/roundRule/select' />), rules: []},
				{key: 'nameEN', label: '英文名称', component: (<Input/>), rules: []},
				{key: 'reportName', label: '报告名称', component: (<Input/>), rules: []},
				{key: 'reportNameEN', label: '英文报告名称', component: (<Input/>), rules: []},
				{key: 'samplingSite', label: '采样点', component: (<Input/>), rules: []},
				{key: 'orderNumber', label: '顺序号', component: (<InputNumber/>), rules: []},
				{key: 'numReplicates', label: '重复次数', component: (<InputNumber/>), rules: []},
				{key: 'max', label: '最大值', component: (<InputNumber/>), rules: []},
				{key: 'min', label: '最小值', component: (<InputNumber/>), rules: []},
				{key: 'indexScope', label: '指标范围', component: (<Input/>), rules: []},
				{key: 'places', label: '修约小数位数', component: (<InputNumber/>), rules: []},
				{key: 'lowControl1', label: '低控限制1', component: (<Input/>), rules: []},
				{key: 'lowControl2', label: '低控限制2', component: (<Input/>), rules: []},
				{key: 'lowControl3', label: '低控限制3', component: (<Input/>), rules: []},
				{key: 'lowControl4', label: '低控限制4', component: (<Input/>), rules: []},
				{key: 'lowControl5', label: '低控限制5', component: (<Input/>), rules: []},
				{key: 'highControl1', label: '高控限制1', component: (<Input/>), rules: []},
				{key: 'highControl2', label: '高控限制2', component: (<Input/>), rules: []},
				{key: 'highControl3', label: '高控限制3', component: (<Input/>), rules: []},
				{key: 'highControl4', label: '高控限制4', component: (<Input/>), rules: []},
				{key: 'highControl5', label: '高控限制5', component: (<Input/>), rules: []},
				{key: 'specRule', label: '判定规则', component: (<Input/>), rules: []},
				{key: 'showOnCoa', label: '是否是报告项', component: (
				<BaseRadio
					data = {[{label:'是', value:'true'},{label:'否', value:'false'}]}
				/>), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
				{key: 'descriptionEN', label: '英文描述', component: (<Input.TextArea/>), rules: []},
			],

		},
		searchForm:{
		    items: [
		      {key: 'name', label: '名称', component: (<Input />)},
		      {key: 'version', label: '版本', component: (<Input />)},
		      {key: 'activation', label: '是否激活', component: (
		      	<RadioGroup>
					<Radio value="true">激活状态</Radio>
					<Radio value="false">禁用状态</Radio>
				</RadioGroup>)},
		    ]
		},
		searchProgramForm:{
		    items: [
		      {key: 'testItem_name', label: '检测项目', component: (<Input />)},
		      {key: 'testStandard_code', label: '产品标准号', component: (<Input />)},
		      {key: 'testStandard_name', label: '产品标准名称', component: (<Input />)},
		      {key: 'testMethod_standardNo', label: '检测方法标准号', component: (<Input />)},
		      {key: 'testMethod_name', label: '检测方法标准名称', component: (<Input />)},
		      {key: 'testMethod_methodNameZH', label: '检测方法', component: (<Input />)},
		    ]
		},
  },
}
export default ProductSetting;
