import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import 'animate.css/animate.min.css';
const FormItem = Form.Item;

class WrappedSearchArea extends Component {
  // 记录搜索区域展开与折叠状态
  state = {
    expand: false,
    inputHeight:'48px',
    formHeight:'-1px',
    inputDisplay: 'block',
    formDisplay: 'none',
    inputValue:'',
  };

  // 切换高级搜索与简易搜索
  toggle = () => {
    const { expand } = this.state;
    if(!expand){
      this.setState({
        inputHeight:'0px',
        inputDisplay: 'none',
        formHeight:'auto',
        formDisplay: 'block',
      });
    }else{
      this.setState({
        inputHeight:'48px',
        inputDisplay: 'block',
        formHeight:'-1px',
        formDisplay: 'none',
      });
    }
    this.setState({ expand: !expand });
    if(this.props.searchToggle)
      this.props.searchToggle(expand);
  }

  render() {
    const {
      inputValue
    } = this.state;

    const {
      colNum,//弹性布局Col倍数，Row为24，Col底值为8
      avancedSearchFormSetting,// 高级搜索表单配置
      simpleSearchKey,// 简易搜索字段数组
      } = this.props;

    const { getFieldDecorator, resetFields } = this.props.form;

    // 生成建议搜索框的placeholder
    const simpleSearchPlaceholder = (searchKey) => {
      let placeholderArr = [];
      let placeholder = '';
      placeholderArr = searchKey.map(item => item[0]);
      placeholderArr = placeholderArr.filter(item => item !== '')
      placeholder = placeholderArr.join('、');
      return placeholder;
    }

    // 生成高级搜索表单
    const renderItem = (item) => {
      return (
        <Col span={8*colNum}>
          <Form.Item
            {...formItemLayout}
            label={item.label}
            hasFeedback
          >
          {getFieldDecorator(item.key)(item.component)}
          </Form.Item>
        </Col>
      );
    };

    const renderForm = (itemConfig) => {
      if(itemConfig)
        return itemConfig.map(item => renderItem(item));
    }

    // 清空表格
    const handleReset = () => {
      this.props.form.resetFields();
    }

    // 高级搜索
    const handleAvancedSearch = () => {
      if(this.props.avancedSearch)
        this.props.avancedSearch(this.props.form.getFieldsValue());
    }

    // 获取搜索框的内容
    const inputValueChange = (e) => {
      this.setState({
        inputValue: e.target.value
      });
    }

    // 简易搜索
    const handleSimpleSearch = () => {
      if(this.props.sampleSearch)
        this.props.sampleSearch(inputValue);
    }

    // 重置数据
    const resetData = () => {
      handleReset();
      this.setState({
        inputValue: '',
      });
      if(this.props.resetData)
        this.props.resetData();
    }

    // 表单样式
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const antAdvancedSearchForm = {
      padding: '10px',
      background: '#fbfbfb',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      display: 'block',
    }

    return (
      <div style={this.props.wrappedSearchAreaStyle} className={this.props.className}>
        <div style={{height:this.state.inputHeight, display: this.state.inputDisplay}}>
          <div
           style={{width: this.props.disabledA ? 'auto' : '340px', height: 48, float:'right'}}>
            <Input
              style={{width: this.props.disabledA ? 'auto' : '250px', margin:'10px 0'}}
              placeholder={simpleSearchPlaceholder(simpleSearchKey)}
              value={this.state.inputValue}
              onChange={inputValueChange}
              onPressEnter={handleSimpleSearch}
              suffix={(
                <Button style={{borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0, marginRight: '-6px'}} size="default" type="primary" onClick={handleSimpleSearch}>
                  <Icon type="search" />
                </Button>
              )}
            />
            {this.props.disabledA ? '' :
              <span style={{display: 'inline-block'}}>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>高级搜索</a>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={resetData}>重置</a>
              </span>
            }
          </div>
        </div>
        <div style={{height:this.state.formHeight, display: this.state.formDisplay}}
         >
          <Form
            style={antAdvancedSearchForm}
          >
            <Row gutter={16}>{renderForm(avancedSearchFormSetting.items)}</Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleAvancedSearch}>搜索</Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>清空</Button>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>简易搜索</a>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={resetData}>重置</a>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(WrappedSearchArea);
