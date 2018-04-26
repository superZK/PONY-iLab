  import React, { Component } from 'react';
  import { Radio } from 'antd';
  import fetchData from '../../util/fetchGateway';
  const RadioGroup = Radio.Group;

  export default class BaseRadio extends Component {
    constructor(props){
      super(props);

      this.state = {
        options: this.props.needRequestData ? [] : (this.props.data || []),
        values: this.props.value || '',
      };
    }
    loadRadioGroup(url) {
      if (!url) {
        url = this.props.url
      }
      fetchData(url).then(
        (receipt) => {
          let arr = [];
          receipt.data.map((item) => {
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
      if(this.props.needRequestData)
        this.loadRadioGroup()
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        values: nextProps.value,
      })
    }

    render() {
      const onChange=(e) => {
        this.setState({
          values: e.target.value,
        });
        if(this.props.onChange) {
          this.props.onChange(e.target.value)
        }
      }

      return <RadioGroup
        disabled={this.props.disabled}
        onChange={onChange}
        value={this.state.values}
        options={this.state.options} />
    }
  }
