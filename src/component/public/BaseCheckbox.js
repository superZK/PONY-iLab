  import React, { Component } from 'react';
  import { Checkbox } from 'antd';
  import fetchData from '../../util/fetchGateway';
  const CheckboxGroup = Checkbox.Group;

  /**
   * 定义BaseCheckbox配置
   * url 配置checkbox 获取数据url
   * disabled  是否禁用
   */

  export default class BaseCheckbox extends Component {
    constructor(props){
      super(props);

      this.state = {
        options: [],
        values: [],
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
             let obj = {};
             obj.label = item.name;
             obj.value = item.id + '';
             arr.push(obj);
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
      const { options, values } = this.state

      const onChange=(checkedList) => {
        this.setState({
          values: checkedList,
        });
        if(this.props.onChange){
          this.props.onChange(checkedList);
        }
      }

      return <CheckboxGroup
        disabled={this.props.disabled}
        onChange={onChange}
        value={values}
        options={options} />
    }
  }
