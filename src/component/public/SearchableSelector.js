import React, { Component } from 'react';
import { Select } from 'antd';
import fetchData from '../../util/fetchGateway';
import { unique, analysisDataIndex } from '../../util/treeUtils';
import TooltipSpan from './Table/TooltipSpan';

export default class SearchableSelector extends Component {
  constructor(props){
    super(props);

    this.state = {
      data: [],
      value: this.props.value || '',
      label: this.props.value,//记录选中项的label
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  loadSelectOptions(byId, value, url){
    if(!url){
      url = this.props.url;
    }
    if((this.props.disabled || this.props.lazyMode) && value !== undefined){
      url += "?" + (byId ? 'i' : 's') + '=' + value || '';
    }
    fetchData(url).then(
      (receipt) => {
        this.setState({
          data: receipt.data,
        });
        // 当可选数据为空时，清空value，避免出现无可选数据时下拉框显示数字的情况
        if(!receipt.data){
          this.handleChange('');
        }
        let {
          defaultValue,//外部组件去控制首加载的项目
          needDefaultSelection,//selector组件内部去控制首加载的项目，默认选择加载数据的第一项
        } = this.props;
        /* 默认显示内容的优先级如下
          1. props中的defaultValue
          2. 如果props中指定了 needDefaultSelection ，则选取第一项
          3. props中指定的value
          4. 空值
        */
        let v = defaultValue;
        if(v === undefined || v === null){
          // 如果没有指定defaultValue，判断是否需要默认选中
          if(needDefaultSelection){
            // 需要默认选中，配置为第一项的值
            v = (needDefaultSelection && receipt.data &&receipt.data[0] && receipt.data[0].options[0]) ? receipt.data[0].options[0].key : '';
          }else{
            // 不需要默认选中，则默认置为props中的value（在作为form element时存在此场景）
            v = this.props.value || '';
          }
        }
        if(v !== this.state.value && v !== '0'){
          // 如果当前value和默认指定的不一样，需要触发change通知外部组件
          this.handleChange(v);//向父组件广播defaultValue，父组件在onChange事件中将自己维护的state变更为defaultValue
        }
      },
      (error) => {console.log(error)}
    );
  }

  componentDidMount(){
     // initialize display text response for value
     if(!this.props.value){
      this.loadSelectOptions(true, this.props.defaultValue);
     }else{
      this.loadSelectOptions(true, this.props.value);
     }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== undefined && nextProps.value !== null){
      // 在form中使用时，需将父组件为selector指定的value同步到state中
      if(('' + nextProps.value) !== ('' + this.state.value)){
        this.setState({value: '' + nextProps.value});
      }
    }
    if(this.props.url !== nextProps.url){
      this.loadSelectOptions(true, this.props.defaultValue, nextProps.url);
    }
  }

  handleChange(value){
    if(value == 0)
      value = '';
    this.setState({
      value: value || '',
    });
    if(this.props.onChange) this.props.onChange(value);
  }

  // 选中某一条数据时触发，用于部门节点
  handleSelect(value, option){
    const label = option.props.label || '';
    this.setState({
      label,
    });
    if(this.props.onSelect) this.props.onSelect(value, option);
  }

  handleSearch(value) {
    if( !value ) return;
    let vt = value.trim();
    if( vt === '' ) return;
    let lc = value.slice(-1);
    let llc = value.slice(-2);
    if( ' ' !== lc || '  ' === llc ) return; // prevent continous space to query
    this.loadSelectOptions(false, vt);
  }

  onBlur(value){
    if(this.props.onBlur)
      // this.props.onBlur(this.state.label);
      this.props.onBlur(value);
  }

  render() {
    const renderRule = (item, keys=['name']) => {
      let renderKeys = [];
      keys.map( (key) => {
        renderKeys.push(analysisDataIndex(item, key));
      });
      let filterRenderKeys = renderKeys.filter(item => item !== undefined);
      filterRenderKeys = unique(filterRenderKeys);
      return filterRenderKeys.join('-');
    }

    const renderOptions = (opts) => opts.map((opt) => <Select.Option key={opt.key} value={opt.key} code={opt.code} shorthand={opt.shorthand} label={opt.name} >
        <TooltipSpan
          spanClass={{}}
          mouseEnterDelay={0.5}
          longNum={200}
          data={renderRule(opt, this.props.renderKey)}
        />
      </Select.Option>);

    const renderGroups = (grps) => grps.map((grp) => {
      return (
        <Select.OptGroup key={grp.key} label={grp.name}>
          {renderOptions(grp.subordinate)}
        </Select.OptGroup>
      );
    });

    const filtOptions = (value, option) => {
      if(option.props.shorthand && option.props.shorthand.includes(value)) return true;
      if(option.props.code && option.props.code.includes(value)) return true;
      if(option.props.label && option.props.label.includes(value)) return true;
      return false;
    }
    return (
      <Select
        {...this.props.options}
        style={{minWidth: 100}}
        value={'' +this.state.value}
        showSearch={true}
        onSearch={this.handleSearch}
        onSelect={this.handleSelect}
        onChange={this.handleChange}
        onBlur={this.onBlur}
        filterOption={(this.props.disabled || this.props.lazyMode) ? false : filtOptions}
        disabled={this.props.disabled}
      >
        { ((this.state.data ? this.state.data[0] : '') && this.state.data[0].options) ? renderOptions(this.state.data[0].options) : '' }
        { ((this.state.data ? this.state.data[0] : '') && this.state.data[0].groups) ? renderGroups(this.state.data[0].groups) : '' }
      </Select>
    );
  }
}
