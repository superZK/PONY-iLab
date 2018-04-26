import React, { Component } from 'react';
import {Row, Col, Form, Input, Button, Radio} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class OfferPriceFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'true',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.includeDisabled) {
          this.props.offerPriceList(values.key, 'false')
        } else {
          this.props.offerPriceList(values.key, 'true')
        }
      }
    });
  }

  // radio value
  onChange(e) {
    this.setState({
      value: e.target.value,
    })
  }

  // 搜索 input
  handleSearch(value) {
    this.props.offerPriceList(value, this.state.value);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const item = [];

    return (
      <Form>
        <Row style={{marginTop: 10}}>
          <Col xs={5} offset={1}>
            <FormItem
               wrapperCol={{ span: 22 }}
              className={'formItem-margin-bottom'}>
              {getFieldDecorator('key', {
                initialValue: item ? item.key : '',
              })(
                <Search
                  placeholder="检测项目名称、方法标准号、名称"
                  onSearch={this.handleSearch}
                /> )}
            </FormItem>
          </Col>
          <Col xs={2} style={{marginLeft: 20}}>
            <FormItem
              wrapperCol={{ span: 22 }}
              className={'formItem-margin-bottom'} >
              {getFieldDecorator('includeDisabled', {
                initialValue: item ? item.includeDisabled : '',
              }
            )(
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={'false'}>包含禁用项目</Radio>
              </RadioGroup>
            )}
            </FormItem>
          </Col>
          <Col xs={1} style={{marginLeft: 15}}>
            <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(OfferPriceFilter)
