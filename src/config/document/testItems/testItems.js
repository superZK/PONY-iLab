import React, {Component} from 'react';
import { Icon, Input, InputNumber, Radio } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
const RadioGroup = Radio.Group;
/**
 * 定义表格的Column配置
 *
 */
const TestItemSetting = {
	table:{
		testItem:{
			key:'testItem',
			name:'检测项目',
			column:[
					{
						title: '检测项目编码',
						dataIndex: 'code',
						key: 'code',
						width: 100,
					},{
						title: '检测项目名称',
						dataIndex: 'name',
						key: 'name',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 28,
						},
						width: 230,
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
						needAdvancedRender: true,
						renderType: '文字提示',
						render: {
							mouseEnterDelay: 0.5,
							longNum: 10,
						},
						width: 100,
					},{
						title: '版本号',
						dataIndex: 'version',
						key: 'version',
						width: 50,
					}, {
						title: '显示名称',
						dataIndex: 'displayAs',
						key: 'displayAs',
						width: 100,
					}, {
						title: '别名',
						dataIndex: 'alias',
						key: 'alias',
						width: 50,
					}, {
						title: '激活标志',
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
						width: 60,
					}, {
						title: '自动审核通过',
						dataIndex: 'autoAuthorize',
						key: 'autoAuthorize',
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
						width: 80,
					}, {
						title: '自动审核拒绝',
						dataIndex: 'autoReject',
						key: 'autoReject',
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
						width: 80,
					}],
				expand:[
					{key:'description', label:'描述'},
					{key:'reportName', label:'报告名称'},
					{key:'reportNameEN', label:'英文报告名称'},
					{key:'cas', label:'CAS号'},
					{key:'synonyms', label:'同义词'},
					{key:'instrumentGroup', label:'仪器组'},
					{key:'instrumentNumber', label:'仪器编号'},
					{key:'lab', label:'实验室'},
					{key:'testLocation', label:'检测地点'},
					{key:'storageCondition', label:'存储条件'},
					{key:'inspectDosage', label:'检测用量'},
					{key:'dosageUnit', label:'检测用量单位'},
					{key:'inspectInterval', label:'检测用时'},
					{key:'unitPrice', label:'单价'},
					{key:'aliquotGroup', label:'分样标记'},
					{key:'destructiveness', label:'是否具有破坏性'},
				],
		},
		resultRecord:{
			key:'resultRecord',
			name:'原始结果项',
			column:[
					{
						title: '名称',
						dataIndex: 'name',
						key: 'name',
					},{
						title: '英文名称',
						dataIndex: 'nameEN',
						key: 'nameEN',
					},{
						title: '序号',
						dataIndex: 'serial',
						key: 'serial',
					},{
						title: '关联单位名称',
						dataIndex: 'measUnit.name',
						key: 'measUnitName',
					}, {
						title: '结果类型',
						dataIndex: 'resultType.name',
						key: 'resultName',
					}, {
						title: '修约规则',
						dataIndex: 'roundRule.name',
						key: 'roundRuleName',
					}, {
						title: 'CAS号',
						dataIndex: 'casNo',
						key: 'casNo',
					}, {
						title: '结果项档案',
						dataIndex: 'resultsFile.name',
						key: 'resultsFileName',
					}, {
						title: '计算公式代码',
						dataIndex: 'formualCode',
						key: 'formualCode',
					}, {
						title: '是否报告项',
						dataIndex: 'reportable',
						key: 'reportable',
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
					}, {
						title: '是否使用仪器',
						dataIndex: 'useinstrument',
						key: 'useinstrument',
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
					},
				],
			expand:[
				{key:'max', label:'最大值'},
				{key:'min', label:'最小值'},
				{key:'places', label:'保留位数'},
				{key:'numReplicates', label:'重复次数'},
				{key:'listEntry', label:'列表代码'},
				{key:'alias', label:'别名'},
				{key:'clampHigh', label:'夹值高限'},
				{key:'clampLow', label:'夹值低限'},
				{key:'reagentType', label:'试剂类型'},
				{key:'allowOut', label:'是否允许超出'},
				{key:'autoCalc', label:'是否自动计算'},
				{key:'allowCancel', label:'是否允许取消'},
				{key:'optional', label:'是否可选'},
				{key:'display', label:'是否显示'},
			],
		},
	},
	form:{
		testItem:{
			submitTitle: '确认',
			items: [
				{key: 'code', label: '检测项目编码', component: (<Input />), rules: [{required: true, message: '检测项目编码不能为空'}, {pattern: '^[a-zA-Z0-9_/-]+$',message: '检测项目编码只能由字母、数字、“-”，“_”、“/”组成' }]},
				{key: 'name', label: '检测项目名称', component: (<Input />), rules: [{required: true, message: '检测项目名称不能为空'}]},
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
				{key: 'description', label: '描述', component: (<Input.TextArea/>), rules: []},
				{key: 'displayAs', label: '显示名称', component: (<Input />), rules: []},
				{key: 'reportName', label: '报告名称', component: (<Input />), rules: []},
				{key: 'reportNameEN', label: '英文报告名称', component: (<Input />), rules: []},
				{key: 'cas', label: 'CAS号', component: (<Input />), rules: []},
				{key: 'synonyms', label: '同义词', component: (<Input />), rules: []},
				{key: 'alias', label: '别名', component: (<Input />), rules: []},
				{key: 'instrumentGroup', label: '仪器组', component: (<Input />), rules: []},
				{key: 'instrumentNumber', label: '仪器编号', component: (<Input />), rules: []},
				{key: 'lab', label: '实验室', component: (<Input />), rules: []},
				{key: 'testLocation', label: '检测地点', component: (<Input />), rules: []},
				{key: 'storageCondition', label: '存储条件', component: (<Input />), rules: []},
				{key: 'inspectDosage', label: '检测用量', component: (<InputNumber />), rules: []},
				{key: 'dosageUnit', label: '检测用量单位', component: (<Input />), rules: []},
				{key: 'inspectInterval', label: '检测用时', component: (<InputNumber />), rules: []},
				{key: 'unitPrice', label: '单价', component: (<InputNumber />), rules: []},
				{key: 'aliquotGroup', label: '分样标记', component: (<Input />), rules: []},
				{key: 'autoAuthorize', label: '自动审核通过', component: (<RadioGroup>
					<Radio value={true} >是</Radio>
					<Radio value={false} >否</Radio>
				</RadioGroup>), rules: []},
				{key: 'autoReject', label: '自动审核拒绝', component: (<RadioGroup>
					<Radio value={true} >是</Radio>
					<Radio value={false} >否</Radio>
				</RadioGroup>), rules: []},
				{key: 'destructiveness', label: '是否具有破坏性', component: (<RadioGroup>
					<Radio value={true} >是</Radio>
					<Radio value={false} >否</Radio>
				</RadioGroup>), rules: []},
			]
		},
		resultRecord:{
			submitTitle: '确认',
			items: [
				{key: 'name', label: '名称', component: (<Input />), rules: [{required: true, message: '名称不能为空'}]},
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
				{key: 'measUnit.id', label: '度量单位', component: (
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
				{key: 'nameEN', label: '英文名称', component: (<Input />), rules: []},
				{key: 'serial', label: '序号', component: (<InputNumber />), rules: []},
				{key: 'max', label: '最大值', component: (<InputNumber />), rules: []},
				{key: 'min', label: '最小值', component: (<InputNumber />), rules: []},
				{key: 'places', label: '保留位数', component: (<InputNumber />), rules: []},
				{key: 'numReplicates', label: '重复次数', component: (<InputNumber />), rules: []},
				{key: 'listEntry', label: '列表代码', component: (<Input />), rules: []},
				{key: 'casNo', label: 'CAS号', component: (<Input />), rules: []},
				{key: 'alias', label: '别名', component: (<Input />), rules: []},
				{key: 'clampHigh', label: '夹值高限', component: (<Input />), rules: []},
				{key: 'clampLow', label: '夹值低限', component: (<Input />), rules: []},
				{key: 'reagentType', label: '试剂类型', component: (<Input />), rules: []},
				{key: 'formualCode', label: '计算公式代码', component: (<Input />), rules: []},
				{key: 'useinstrument', label: '是否使用仪器', component: (
				<RadioGroup>
					<Radio value={true}>是</Radio>
					<Radio value={false}>否</Radio>
				</RadioGroup>), rules: []},
				{key: 'reportable', label: '是否报告项', component: (
				<RadioGroup>
					<Radio value={true}>是</Radio>
					<Radio value={false}>否</Radio>
				</RadioGroup>), rules: []},
				{key: 'allowOut', label: '是否允许超出', component: (
				<RadioGroup>
					<Radio value={true}>是</Radio>
					<Radio value={false}>否</Radio>
				</RadioGroup>), rules: []},
				{key: 'autoCalc', label: '是否自动计算', component: (
					<RadioGroup>
						<Radio value={true}>是</Radio>
						<Radio value={false}>否</Radio>
					</RadioGroup>), rules: []},
				{key: 'allowCancel', label: '是否允许取消', component: (
					<RadioGroup>
						<Radio value={true}>是</Radio>
						<Radio value={false}>否</Radio>
					</RadioGroup>), rules: []},
				{key: 'optional', label: '是否可选', component: (
					<RadioGroup>
						<Radio value={true}>是</Radio>
						<Radio value={false}>否</Radio>
					</RadioGroup>), rules: []},
				{key: 'display', label: '是否显示', component: (
					<RadioGroup>
						<Radio value={true}>是</Radio>
						<Radio value={false}>否</Radio>
					</RadioGroup>), rules: []},
			],
		},
		searchForm:{
		    items: [
		      {key: 'name', label: '检测项目名称', component: (<Input />)},
		      {key: 'displayAs', label: '显示名称', component: (<Input />)},
		      {key: 'alias', label: '别名', component: (<Input />)},
		    ]
		},
  }
}
export default TestItemSetting;
