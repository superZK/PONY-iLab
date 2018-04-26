/**
 * Created by Z.K. on 2018/2/3.
 */
import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames/bind';
import TagGroup from './TagGroup';
import TooltipSpan from './TooltipSpan';
import EditableTableCell from './EditableTableCell';
import WrappedSearchArea from './WrappedSearchArea';
import OperationPanel from '../OperationPanel/OperationPanel';
import { Table, Row, Col, Icon, Input, Alert, Tag, message } from 'antd';
import { uniqueObj, unique, replaceNodeById, removeNodeById, analysisDataIndex, findParentNodeById } from '../../../util/treeUtils';
import { spliceURL } from '../../../util/fetchGateway';
import './index.css';

/**
 * 高级表格组件
 * ************************************************
 * static state{
 *  勾选项Key数组
 *  preparedKeys: []
 *
 *  行点击项Key
 *  selectedKey: ''
 *
 *  行展开项Key
 *  expandedRowKey: ''
 *
 *  符合过滤条件的数据
 *  filterData: []
 *
 *  是否显示过滤后的数据
 *  showFilterData: false
 *
 *  批量填充的key和源对象
 *  fillKey: String,
 *  fillSource: Object,
 *
 *  批量填充开始位置
 *  fillStart: '',
 *
 *  tags是否清空受控属性
 *  clearAllTags: false,
 * }
 * **************************************************
 * static props{
 *  控制组件是否使用搜索区与tag提示区
 *  mode: Default(默认值):默认全部功能开启  Search:只开启搜索区  Alert:只开启提示区  Simple：均不开启
 *
 *  表格在使用于modal中，modal打开关闭状态
 *  visible: boolean  用于判断是否清空表格状态
 *
 *  分页功能配置项，参考Pagination组件
 *  pagination:{this.props.pagination || {pageSize:20, showQuickJumper:true}}
 *
 *  隐藏表格全选框
 *  hideRowSelection： boolean
 *
 *  全选框类型
 *  type: String 'checkbox'||'radio'
 *
 *  定义表格滚动区域，用于实现固定头/列，需配合columns配置项
 *  scroll: {{x:1500, y: 340}} (无需滚动区域设置为{{x:0, y:0}})
 *
 *  配置表格columns
 *  setting 详见columns配置
 *
 *  是否开启表格行展开功能
 *  isExpanded: boolean
 *
 *  简易搜索匹配字段
 *  simpleSearchKey: [Array[String]]
 *                   [['订单编号','orderNo'],['样品编号','serialNo'],['','testName']] (第一项可以为空)
 *                   二维数组第一项用于simpleSearchInput的友好提示，第二项用于确定搜索的匹配字段
 *
 *  高级搜索表单配置
 *  avancedSearchForm: 参见BaseForm
 *  注意：高级搜索表单支持dataIndex的a.b.c的嵌套形式，但key值应为 sampleType_orders_orderNo 以_分隔开的形式， 组件内部会转化成sampleType.orders.orderNo形式
 * 例：items: [{key: 'sampleType_orders_orderNo', label: '订单编号', component: (<Input />)},]
 *
 *  高级搜索表单排列规则
 *  colNum: String  三列：'1'、两列：'1.5'、一列：'3'
 *
 *  隐藏搜索区
 *  hideSearch: boolean    true时隐藏   默认不指定为显示
 *
 *  向父组件暴露自身搜索区域的切换状态
 *  searchToggle 目前用于通过状态来控制按钮组的样式
 *
 *  数据提示区tag标签显示内容的规则
 *  renderKey: ['key1', 'key2', 'key3']  ->  value1_value2_value3
 *
 *  数据数组
 *  data: [],需自己在reducer中生成key，或让后台生成
 *
 *  表格行选中事件
 *  onSelect(selectKey:number)
 *
 *  表格勾选事件
 *  onPrepare(rows:[object], rowKeys:[string])
 *
 *  批量填充的结束序号
 *  FillEnd: number
 *
 *  批量填充可填充规则(可选项)
 *  fillRule：Array    [{changeKey: 'name', judgmentKey: 'status', judgmentValue: ['审核']}] changeKey:想要填充的列的Key， judgmentKey: 判断能否填充的条件的Key，例 根据状态判断：‘status’，  judgmentValue:Array  判断能否填充的条件的值
 *
 *  保存所有编辑内容
 *  saveAll: boolean, 决定是否触发onSave函数  默认为false
 *  onSave: func (dataSource) => {}
 *
 *  适配左侧列表搜索
 *  disabledA: boolean, 决定是否需要高级搜索按钮和input的宽度  默认为false
 *
 *  行操作操作项数组
 *  operating: [{name:'新增', icon:<Icon type="edit" className='IconL' />, handler(){console.log('handler')}},{},{}]   (icon可选)
 *
 *  其他antd-table可配置项
 *  options: {...props}
 * }
 * *************************************************
 * columns{
 * calssName: 列样式  想实现数字列右对齐可使用 ：'table-right'
 * title:表头
 * dataIndex:字段名称
 * width:列宽(实现表格滚动必须为每列指定固定宽度)
 * needAdvancedRender:单元格是否需要高级渲染，即render属性
 * renderType:渲染类型 ->'文字提示'(用于展示长内容)、'图标'、'状态点'、'可编辑'、'行操作'
 * render:{
 *    ***********文字提示***********
 *    spanClass: 单元格内span的样式，默认不指定时样式为空 {}
 *    mouseEnterDelay: number  触发展示所有文字动作所需要的鼠标悬停的时间
 *    longNum: number  定义文字的长度为多少时折叠显示
 *
 *    *************图标*************
 *    showIconRule: (value) => {switch(value){}} 根据同一字段的不同值返回不同的图标
 *
 *    ***********状态点*************
 *    processStatus: 表示数据状态值的字段名，
 *    processRule: (status) => {switch(status){}} 状态与状态点匹配规则
 *
 *    ***********可编辑*************
 *    editingMethod: 编辑形式 -> '整数'、'文本'、'选择'  优先级：数据指定的editingMethod(只对本条数据生效) > columns指定的editingMethod(对整列生效)
 *    editControlRule:['key1','key2']  编辑状态的控制规则，根据指定字段值的不同，切换是否可编辑
 *    editControl:(key) => {switch(key){}} 指定key的值对应的可编辑状态
 *    max:编辑形式为整数时的最大值（优先级为数据自身的最大值 > columns指定的最大值）
 *    min:编辑形式为整数时的最小值（优先级为数据自身的最小值 > columns指定的最小值）
 *    url:编辑形式为选择时，selector组件需要的url
 *    urlParameter:{..., 拼接在url上的参数名(Key): (value)参数值对应的数据的字段名}  URL参数Obj
 *
 *    ***********行操作*************
 *         trigger：  触发行为，可选 hover/focus/click(默认)   String
 *    overlayStyle:   卡片样式,默认:{{width: 200}}
 *       placement:   气泡框位置(可选项参照antd),默认：'top'
 *           title:   卡片标题,默认： '操作盘'
 *      buttonName:   按钮标题,默认:  '操作'
 * }
 * }
 */

export default class AdvancedTable extends Component {
  constructor(props){
    super(props);

    this.state = {
      // BaseTable
      preparedKeys: [],
      selectedKey: '',
      expandedRowKey: '',
      // SearchTable
      filterData: [],
      showFilterData: false,
      // EditableTable
      dataSource: this.props.data,
      // AlertTable
      preparedRows: [{key:'1', name:'无任何勾选项'}],
      // 批量填充
      fillKey: '',
      fillSource: '',
      // 功能选项
      mode: this.props.mode || 'Default',
      // 是否清空所有tags受控属性
      clearAllTags: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handlePrepare = this.handlePrepare.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.renderExpandedRow = this.renderExpandedRow.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.switchRenderType = this.switchRenderType.bind(this);
    this.switchEditChange = this.switchEditChange.bind(this);
    this.switchIcon = this.switchIcon.bind(this);
    this.generateSwitchParameter = this.generateSwitchParameter.bind(this);
    this.generateURLParameter = this.generateURLParameter.bind(this);
    this.onTextCellChange = this.onTextCellChange.bind(this);
    this.onSelectCellChange = this.onSelectCellChange.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    // 原始数据变化时变更state：dataSource，配合可编辑使用,并通知tag区清空所有的tags标签
    if(this.state.dataSource !== nextProps.data){
      this.setState({
        dataSource: nextProps.data,
        preparedRows: [{key:'1', name:'无任何勾选项'}],
      });
    }
    // 配合可搜索使用
    let filterData = this.state.filterData;
    replaceNodeById(filterData, 'id', nextProps.data);
    if(this.props.data != nextProps.data){
      this.setState({
        preparedKeys: [], //如果想实现类似于跨样品选择任务的场景，preparedKeys不能清空
        selectedKey: '',
        filterData,
        showFilterData: false,
      });
    }
    // 配合modal使用，打开或者关闭modal后，清空状态
    if(this.props.visible && this.props.visible !== nextProps.visible){
      this.setState({
        preparedKeys: [],
        selectedKey: [],
      });
    }
    // 配合可编辑单元格使用
    if(nextProps.saveAll){
      if(this.props.onSave)
        this.props.onSave(this.props.data)
    }
    // 配合批量填充使用
    if(this.state.fillKey && this.state.fillSource && nextProps.fillEnd){
      const fillKey = this.state.fillKey;
      let fillKeyArr = fillKey.split('.');
      let record = this.state.fillSource;
      const fillEnd = nextProps.fillEnd;
      let fillTarget = this.props.data.slice(record.serialNumber, fillEnd > this.props.data.length ? this.props.data.length : fillEnd);
      let fillRule = this.props.fillRule || [];
      if(fillRule.length > 0 && fillRule.filter( rule => rule.changeKey === fillKey).length > 0){
        fillRule.map((rule) => {
          if(rule.changeKey === fillKey && !(rule.judgmentValue.includes(record[rule.judgmentKey]))){
            let afterFill = fillTarget.map((item) => {
              for(let i = 0; i < fillKeyArr.length - 1; i++){
                item = item[fillKeyArr[i]];
              }
              item[fillKeyArr[fillKeyArr.length - 1]] = analysisDataIndex(record, fillKey);
              return item;
            });
          }
        });
      }else{
        for(let j = 0; j < fillKeyArr.length - 1; j++){
          record = record[fillKeyArr[j]];
        }
        let afterFill = fillTarget.map((item) => {
          for(let i = 0; i < fillKeyArr.length - 1; i++){
            item = item[fillKeyArr[i]];
          }
          item[fillKeyArr[fillKeyArr.length - 1]] = record[fillKeyArr[fillKeyArr.length - 1]];
          return item;
        });
      }
    }
  }

  // 文本类型编辑
  onTextCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = this.state.dataSource;
      let target = dataSource.find(item => item.key == key);
      if (target) {
        // 适配dataIndex为verifier.verifier这种形式的
        let dataIndexArr = dataIndex.split('.');
        for(let i = 0; i < dataIndexArr.length - 1; i++){
          target = target[dataIndexArr[i]]
        }
        target[dataIndexArr[dataIndexArr.length - 1]] = value;
        this.setState({ dataSource });
      }
    };
  }

  // 选择类型编辑
  onSelectCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = this.state.dataSource;
      let target = dataSource.find(item => item.key == key);
      if (target) {
        // 适配dataIndex为verifier.verifier这种形式的
        let dataIndexArr = dataIndex.split('.');
        for(let i = 0; i < dataIndexArr.length - 1; i++){
          target = target[dataIndexArr[i]] || {};
        }
        target[dataIndexArr[dataIndexArr.length - 1]] = value;
        this.setState({ dataSource });
      }
    };
  }

  /**
 *编辑表格单元格，当数据来源为请求数据时(例：下拉选择),需要使用的url在此处生成
 * @param record 单元格对象
 * @param url URL：String
 * @param urlParameter URL参数Obj   {..., Key拼接在url上的参数名: value参数值对应的数据 dataIndex}
 */
  generateURLParameter(record, url, urlParameter){
    if(!url) return null;
    if(urlParameter){
      let params = {};
      let keys = Object.keys(urlParameter);
      let dataIndex = Object.values(urlParameter);
      for(let i = 0; i < keys.length; i++){
        params[keys[i]] = record[dataIndex[i]]
      }
      return spliceURL(url, params);
    }else{
      return url;
    }
  }

  // 表格单元格可编辑状态相关 -> 生成供columns中可编辑性判断函数：editControl使用的switch参数
  generateSwitchParameter(record, dataIndexArr){
    if(!dataIndexArr) return;
    let switchParameter = '';
    dataIndexArr.map((item) => {
      switchParameter += record[item];
    });
    return switchParameter;
  }

  //根据同意字段的不同值渲染不同的图标
  switchIcon(value, callback){
    return callback(value);
  }

  // 根据表格编辑类型选择表格编辑组件
  switchEditChange(key, dataIndex, editingMethod){
    switch(editingMethod){
      case '文本':
      case '整数':
        return this.onTextCellChange(key, dataIndex);
      case '选择':
        return this.onSelectCellChange(key, dataIndex);
    }
  }

  // 根据表格编辑类型选择表格编辑函数
  switchRenderType(columnItem, text, record){
    let value = analysisDataIndex(record, columnItem.dataIndex);
    switch(columnItem.renderType){
      case '图标':
        return (
          this.switchIcon(value, columnItem.render.showIconRule)
        );
      case '文字提示':
        return (
          <TooltipSpan
            spanClass={columnItem.render.spanClass || {}}
            mouseEnterDelay={columnItem.render.mouseEnterDelay || 0.5}
            longNum={columnItem.render.longNum || 20}
            data={value}
          />
        );
      case '状态点':
        return (columnItem.render.processRule(analysisDataIndex(record, columnItem.render.processStatus)));
      case '可编辑':
        return (
          <EditableTableCell
            value={value || ''}
            resultType={record.editingMethod || columnItem.render.editingMethod}//编辑类型、最大值、最小值等属性先以数据自身值为依据，若数据自身未指定，再以columns.render内指定值为准(注：以columns为准则会指定一整列的渲染规则)
            max={record.max || record[columnItem.render.max]}
            min={record.min || record[columnItem.render.min]}
            canEdit={columnItem.render.editControl ? columnItem.render.editControl(this.generateSwitchParameter(record, columnItem.render.editControlRule)) : true}//通过数据状态等依据判断编辑功能是否可用
            URL={this.generateURLParameter(record, columnItem.render.url, columnItem.render.urlParameter)}
            onChange={this.switchEditChange(record.key, columnItem.dataIndex, (record.editingMethod || columnItem.render.editingMethod))}
          />
        );
      case '行操作':
        return (
          <OperationPanel
            // getPopupContainer={() => this.refs.table}
            trigger={columnItem.render.trigger || null}
            overlayStyle={columnItem.render.overlayStyle || null}
            placement={columnItem.render.placement || null}
            title={columnItem.render.title || null}
            buttonName={columnItem.render.buttonName || null}
            operating={this.props.operating || null}//由props传递过来而不是columns
          />
        );
    }
  }

  // 生成columns配置
  renderColumns(setting){
    let columns = [];
    setting.map((item) => {
      let obj = {};
      obj.className = item.className || null;
      obj.title = item.title;
      obj.dataIndex = item.dataIndex;
      obj.width = item.width || null;
      obj.fixed = item.fixed || false;
      if(item.needCellClick){
        obj.onCellClick = (record, event) => {
          this.setState({
            fillKey : item.dataIndex,
            fillSource : record,
          });
          if(record && record[item.dataIndex]){
            message.success('复制成功');
          }
        };
      }
      obj.render = item.needAdvancedRender ? (text, record) => {return this.switchRenderType(item, text, record)} : text => text || '空';
      if(item.renderType === '行操作')
      obj.className = 'center';
      columns.push(obj);
    });
    return columns;
  }

  // 选择全部
  selectAll(){
    let data = this.state.showFilterData ? this.state.filterData : this.props.data;
    let preparedKeys = data.map(item => item.key);
    this.setState({
      preparedKeys,
      preparedRows: data,
    });
    if(this.props.onPrepare){
      this.props.onPrepare(data, preparedKeys);
    }
  }

  // 清空全部
  clearAll(){
    this.setState({
      preparedKeys: [],
      preparedRows: [{key:'1', name:'无任何勾选项'}],
    });
    if(this.props.onPrepare){
      this.props.onPrepare([{key:'1', name:'无任何勾选项'}], []);
    }
  }

  handleSelect(record, index){
    let selectedKey = record.key;
    this.setState({selectedKey});
    if(this.props.onSelect){
      this.props.onSelect(record);
    }
  }

  // 双击勾选数据
  handleDoubleClick(record, index, e){
    e.preventDefault();
    let doubleItemKeys = record.key;
    let doubleItemRows = [];
    let preparedKeys = this.state.preparedKeys;
    let spliceIndex = -2;
    spliceIndex = preparedKeys.findIndex(item => item === doubleItemKeys);
    if(spliceIndex >= 0){
      preparedKeys.splice(spliceIndex, 1);
    }else{
      preparedKeys.push(doubleItemKeys);
    }
    this.setState({
      preparedKeys,
    });

    if(preparedKeys.length > 0){
      preparedKeys.map((item) => {
        doubleItemRows.push(findParentNodeById(this.props.data, 'key', item));
      });
      if(this.props.onPrepare){
        this.props.onPrepare(doubleItemRows, preparedKeys);
        this.setState({
          preparedKeys,
          preparedRows: doubleItemRows,
        });
      }
    }else{
      if(this.props.onPrepare){
        this.props.onPrepare([], []);
        this.setState({
          preparedKeys: [],
          preparedRows: [{key:'1', name:'无任何勾选项'}],
        });
      }
    }
  }

  /*
  勾选表格数据时如何判断是增加还是减少勾选项，通过selectedRowKeys和this.state.preparedKeys数组长度的对比，假如表格组件维护的selectedRowKeys长度小于this.state.preparedKeys本地状态维护的长度，则肯定是减少勾选项
  */
  handlePrepare(selectedRowKeys, selectedRows){
    let preparedKeys = selectedRowKeys;
    let preparedRows = [];
    // 控制preparedKeys
    if(selectedRowKeys.length < this.state.preparedKeys.length){
      preparedKeys = selectedRowKeys;
    }else{
      preparedKeys = preparedKeys.concat(this.state.preparedKeys);
    }
    // 控制preparedRows
    if(this.state.preparedRows[0].name === '无任何勾选项'){
      preparedRows = preparedRows.concat(selectedRows);
    }else if(selectedRowKeys.length < this.state.preparedKeys.length){
      let deleteItemKey = this.state.preparedKeys.filter(item => selectedRowKeys.indexOf(item) === -1);
      removeNodeById(this.state.preparedRows, 'key', deleteItemKey);
      preparedRows = this.state.preparedRows;
    }else{
      preparedRows = this.state.preparedRows.concat(selectedRows);
    }
    preparedRows = uniqueObj(preparedRows, 'key');
    preparedKeys = unique(preparedKeys);
    const totalKeys = this.props.data.map(item => item.key);
    preparedKeys = preparedKeys.map((item) => {
      if(totalKeys.includes(item)){
        return item;
      }
    }).filter(item => (item && item !== undefined));
    preparedRows = preparedKeys.map((item) => {
      return findParentNodeById(this.props.data, 'key', item);
    });
    if(preparedRows.length === 0){
      preparedRows = [{key:'1', name:'无任何勾选项'}];
    }
    this.setState({
      preparedKeys,
      preparedRows,
    });
    if(this.props.onPrepare){
      this.props.onPrepare(preparedRows, preparedKeys);
    }
  }

  handleExpand(expanded, record) {
    this.setState({
      expandedRowKey: (expanded ? record.key : ''),
    });
  }

  renderExpandedRow(record){
    let config = (this.props.setting.expand) ? this.props.setting.expand : [];
    if(!config || config.length === 0) return '';
    const lableStyle = {color: '#99a9bf', fontSize: '14px', marginRight: '5px'};
    const spanStyle = {width: '200px',  float: 'right', border: '1px solid #ccc', borderRadius:'4px', marginRight: '10px', textAlign: 'center', height: '19px' };
    const radioStyle = {width: '200px', float: 'right', marginRight: '10px', textAlign: 'center', height: '19px', };
    return (
      <div>
        <Row gutter={16} style={{textAlign: 'right'}}>
          {config.map( (item) => {
            // 根据不同值类型，渲染不同span
            if(typeof(record[item.key]) === 'boolean'){
              return(
                <Col span={8} >
                  <label style={lableStyle}>{item.label}:</label><span style={radioStyle}>{record[item.key]  ? <Icon type="check-circle" style={{fontSize: 16, color : '#00A854'}}/> : <Icon type="close-circle" style={{fontSize: 16, color : '#F04134'}}/> }</span>
                </Col>
              )
            }else{
              return (
              <Col span={8} >
                <label style={lableStyle}>{item.label}:</label><TooltipSpan mouseEnterDelay={0.5} longNum={item.longNum || 20} data={analysisDataIndex(record, item.key)}/>
              </Col>
              );
            }
          } )}
        </Row>
      </div>
    );
  }

  render() {
    const tableRowSelection = {
      type: this.props.type || 'checkbox',
      selectedRowKeys: this.state.preparedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.handlePrepare(selectedRowKeys, selectedRows);
      }
    };

    const getRowStyle = (record, index) => {
      // 隔行变色
      if(index%2==0){
        if(record.key === this.state.selectedKey){
          console.log(record);
          return 'rowClickClass';
        }
        return 'tableOddClass';
      }else if(record.key === this.state.selectedKey){
        return 'rowClickClass';
      }
    }

    const Expanded = (this.props.isExpanded) ? {
      expandedRowKeys: [this.state.expandedRowKey],
      onExpand : this.handleExpand,
      expandedRowRender : this.renderExpandedRow,
    } : {};

    // 删除tag
    const filterPreparedKeys = (removeId) => {
      const afterFilterPreparedKeys = this.state.preparedKeys.filter(key => key !== removeId);
      const afterFilterPreparedRows = this.state.preparedRows.filter(row => row.key !== removeId);
      this.setState({
        preparedKeys: afterFilterPreparedKeys,
        preparedRows: afterFilterPreparedRows.length > 0 ? afterFilterPreparedRows : [{key:'无任何勾选项',name:'无任何勾选项'}],
      });
      //tag与表格勾选项联动，保证出现在审核modal的数据条数正确
      if(this.props.onPrepare)
        this.props.onPrepare(afterFilterPreparedRows, afterFilterPreparedKeys);
    }

    // 简易搜索
    const sampleSearch = (searchValue) => {
      // 当搜索值为空且为搜索后状态时，恢复到搜索前状态
      if(!searchValue && this.state.showFilterData){
        this.setState({
          showFilterData: false,
        });
        return;
      }
      const originalData = this.props.data;
      const searchKey = this.props.simpleSearchKey.map(item => item[1]);
      let filterData = [];
      originalData.map((item) => {
        for(let i = 0; i < searchKey.length; i++){
          let targetValue = analysisDataIndex(item, searchKey[i]);
          if(targetValue && targetValue.includes(searchValue)){
            //过滤相同数据
            if(!(filterData.find( element => element.key === item.key))){
              filterData.push(item);
              continue;
            }
          }
        }
      });
      // // 过滤出去的数据需要取消勾选以及点选状态
      // let preparedKeys = this.state.preparedKeys || [];
      // let filterKey = filterData.map( item => item.key);
      // let needShowKeys = [];
      // let needShowItems = [];
      // preparedKeys.map((item) => {
      //   if(filterKey.includes(item)){
      //     needShowKeys.push(item);
      //   }
      // });
      // needShowItems = filterData.filter((item) => {
      //   if(needShowKeys.includes(item.key))
      //     return item;
      // });
      // if(this.props.onPrepare){
      //   this.props.onPrepare(needShowItems, needShowKeys);
      // }

      this.setState({
        filterData,
        showFilterData: true,
        // preparedKeys: needShowKeys,
      });
    }

    // 高级搜索
    const advancedSearch = (formValue) => {
      const originalData = this.props.data;
      const searchKey = Object.keys(formValue).map(item => item.replace(/_/g,'.'));
      const searchValues = Object.values(formValue);
      // 记录form组件是否为input，是则使用模糊查询规则，不是则使用全字匹配规则
      const isInputArr = this.props.avancedSearchForm.items.map(
        (item) => {
          if(item.component.props.prefixCls === 'ant-input'){
            return true;
          }
          return false;
        }
      );
      let isMoment = true;//记录搜索值是否为时间格式
      let momentKey = '';//记录搜索值为时间的字段的key
      let momentValue = '';//记录搜索值为时间的字段的value
      for(let i = 0; i < searchValues.length; i++){
        if(typeof(searchValues[i]) === 'object' && searchValues[i].length === 2){
          searchValues[i].map((moment) => {
            if(!moment._isAMomentObject){
              isMoment = false;
            }
          });
          if(isMoment){
            momentValue = searchValues[i];
            momentKey = searchKey[i];
            searchValues.splice(i, 1);
            searchKey.splice(i, 1);
          }
        }
      }
      let filterData = [];
      originalData.map((item) => {
        let match = true;
        // 对搜索值为时间的字段进行匹配判断
        if(isMoment && momentKey && momentValue){
          momentValue[0] = momentValue[0].hour(0).minute(0).second(0);
          momentValue[1] = momentValue[1].hour(0).minute(0).second(1);
          const dateValue = analysisDataIndex(item, momentKey);
          if(!(moment(dateValue).second(1).isBetween(momentValue[0], momentValue[1])))
            match = false;
        }
        for(let i = 0; i < searchKey.length; i++){
          let targetValue = analysisDataIndex(item, searchKey[i]);
          if(!targetValue && searchValues[i]) match = false;
          if(searchValues[i] && targetValue && targetValue.toString()){
            if(isInputArr[i]){
              if(!((targetValue).toString()).includes(searchValues[i])){
                match = false;
              }
            }else{
              if((targetValue).toString() !== searchValues[i]){
                match = false;
              }
            }
          }
        }
        if(match){
          //过滤相同数据
          if(!(filterData.find( element => element.key === item.key))){
            filterData.push(item);
          }
        }
      });
      // // 过滤出去的数据需要取消勾选以及点选状态
      // let preparedKeys = this.state.preparedKeys || [];
      // let filterKey = filterData.map( item => item.key);
      // let needShowKeys = [];
      // let needShowItems = [];
      // preparedKeys.map((item) => {
      //   if(filterKey.includes(item)){
      //     needShowKeys.push(item);
      //   }
      // });
      // needShowItems = filterData.filter((item) => {
      //   if(needShowKeys.includes(item.key))
      //     return item;
      // });
      // if(this.props.onPrepare){
      //   this.props.onPrepare(needShowItems, needShowKeys);
      // }

      this.setState({
        filterData,
        showFilterData: true,
        // preparedKeys: needShowKeys,
      });
    }

    // 重置数据,清空状态
    const resetData = () => {
      this.setState({
        showFilterData: false,
        preparedKeys: [],
        filterData: [],
      });
      if(this.props.onPrepare){
        this.props.onPrepare([], []);
      }
    }

    // 向外暴露高级搜索与简易搜索的切换状态，用于控制样式
    const searchToggle = (expand) => {
      if(this.props.searchToggle)
        this.props.searchToggle(expand);
    }

    let searchClassName = classNames({
      hideSearch: this.state.mode === 'Alert' || this.state.mode === 'Simple',
    });

    let alertClassName = classNames({
      hideAlert: this.state.mode === 'Search' || this.state.mode === 'Simple',
    });

    return (
      <div>
        {this.state.mode === 'Default' || this.state.mode === 'Search' ?
        <WrappedSearchArea
          className = {searchClassName}
          wrappedSearchAreaStyle = {this.props.hideSearch ? {display: 'none'} : {}}
          colNum = {this.props.colNum || 1}
          sampleSearch={sampleSearch}
          avancedSearch={advancedSearch}
          resetData={resetData}
          searchToggle={this.props.searchToggle || null}
          simpleSearchKey={this.props.simpleSearchKey || []}
          avancedSearchFormSetting={this.props.avancedSearchForm || {}}
          disabledA={this.props.disabledA}
        /> : null}
        {this.state.mode === 'Default' || this.state.mode === 'Alert' ?
        <Alert
          className={alertClassName}
          type="info"
          showIcon={true}
          closable={true}
          message={
            <div>
              <span>已选择{this.state.preparedKeys.length || 0}项。{this.state.preparedKeys.length === (this.state.showFilterData ? this.state.filterData.length : this.props.data.length) ? <a onClick={this.clearAll} >清空全部</a> : <a onClick={this.selectAll}>选择全部{this.state.showFilterData ? this.state.filterData.length : this.props.data.length || 0}项</a>}</span>
              <TagGroup
                clearAll={this.state.clearAllTags}
                filterPreparedKeys={filterPreparedKeys}
                renderKey={this.props.renderKey}
                data={this.state.preparedRows}
              />
            </div>}
        /> : null}
        <Table
          ref='table'
          {...this.props.options}
          {...Expanded}
          bordered
          size='small'
          pagination={this.props.pagination || {pageSize:20, showQuickJumper:true}}
          rowSelection={this.props.hideRowSelection ? null : tableRowSelection}
          onRowClick={this.handleSelect}
          onRowDoubleClick={this.handleDoubleClick}
          rowClassName={getRowStyle}
          scroll={this.props.scroll || {x:0, y:0}}
          columns={this.renderColumns(this.props.setting.column)}
          dataSource={this.state.showFilterData ? this.state.filterData : this.props.data}
        />
      </div>
    );
  }
}
