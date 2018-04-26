  import React, { Component } from 'react';
  import { Checkbox } from 'antd';
  import fetchData from '../../util/fetchGateway';
  const CheckboxGroup = Checkbox.Group;

  /**
   * 定义BaseCheckbox配置
   * url 配置checkbox 获取数据url
   * disabled  是否禁用
   * AllCheckBox   是否显示全选
   */

  export default class BaseCheckboxAll extends Component {
    constructor(props){
      super(props);

      this.state = {
        options: [],
        values: [],
        indeterminate: true,
        checkAll: false,
      };
    }
    loadCheckbox(url) {
      if (!url) {
        url = this.props.url
      }
      fetchData(url).then(
        (receipt) => {
          let arr = [];
          ((receipt && receipt.data) || []).map((item) => {
             arr.push({label:item.name, value: item.id + ''});
          })
          this.setState({
            options: arr
          })
        }, (error) => {console.log(error);}
      )
    }

    componentDidMount() {
      this.loadCheckbox()
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.value)
        this.setState({
          values: typeof(nextProps.value) === 'string' ? [nextProps.value] : nextProps.value,
        })
    }

    render() {
      const { options, values, indeterminate, checkAll } = this.state

      const onChange=(checkedList) => {
        this.setState({
          ...this.state,
          values: checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < options.length),
          checkAll: checkedList.length === options.length,
        });
        if(this.props.onChange){
          this.props.onChange(checkedList);
        }
      }

      const onCheckAllChange = (e) => {
        this.setState({
          ...this.state,
          values: e.target.checked ? options.map(_ => _.value) : [],
          indeterminate: false,
          checkAll: e.target.checked,
        },() => {
          if(this.props.onChange) {
            this.props.onChange(e.target.checked ? options.map(_ => _.value) : [])
          }
        })
      }

      return (
        <div>
          {this.props.AllCheckBox ? <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}>全选</Checkbox> : ''}
          <CheckboxGroup
            disabled={this.props.disabled}
            onChange={onChange}
            value={values}
            options={options} />
        </div>
      )
    }
  }
