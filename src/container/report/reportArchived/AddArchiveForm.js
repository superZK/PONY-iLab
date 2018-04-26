import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';
import './styles.css';

const FormItem = Form.Item;

class AddArchiveForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let {onFormSubmitSuccess} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(onFormSubmitSuccess) {onFormSubmitSuccess(values)};
      }
    });
  }

  handlePressEnter(e){
    if(e.target.value !== '') {
      this.props.reportNumber(e.target.value);
      this.reportNoInput.focus();
      // setFieldsValue
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {item} = this.props;

    const formItemLayout = {
      labelCol: {
        xs: 6
      },
      wrapperCol: {
        xs: 16
      }
    }
    const formItemLayouts = {
      labelCol: {
        xs: 12
      },
      wrapperCol: {
        xs: 8
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row style={{marginTop: 15}}>
          <Col xs={10}>
            <FormItem
              {...formItemLayout}
              label='报告编号'>
              {getFieldDecorator('num', {
                initialValue: item ? item.num : '',
              })(
                <Input
                  onPressEnter={this.handlePressEnter}
                  ref={node => this.reportNoInput = node}
                  placeholder='请扫描报告编号' />
              )}
            </FormItem>
          </Col>
          <Col xs={5}>
            <FormItem
              {...formItemLayouts}
              label='状态正常'>
              {getFieldDecorator('normalStatus', {
                initialValue: item ? item.normalStatus : '',
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col xs={5}>
            <FormItem
              {...formItemLayouts}
              label='状态异常'>
              {getFieldDecorator('exceptionStatus', {
                initialValue: item ? item.exceptionStatus : '',
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <FormItem
              {...formItemLayout}
              label='存放分类'>
              {getFieldDecorator('reportContainerTypeId', {
                initialValue: item ? item.reportContainerTypeId : '',
                rules: [{required: true, message: '请选择存放分类'}]
              })(
                <SearchableSelector
      						options={{allowClear: true}}
      						// lazyMode={false}
      						placeholder='请选择存放分类'
      						url='/doc/categories/select/1023' />
              )}
            </FormItem>
          </Col>
          <Col xs={10}>
            <FormItem
              {...formItemLayout}
              label='存放位置'>
              {getFieldDecorator('locationId', {
                initialValue: item ? item.locationId : '',
                rules: [{required: true, message: '请选择存放位置'}]
              })(
                <SearchableSelector
      						options={{allowClear: true}}
      						placeholder='请选择存放位置'
      						url='/loc/sLocation/query/report' />
              )}
            </FormItem>
          </Col>
          <Col xs={2}>
            <Button type="primary" htmlType="submit" style={{display: 'none'}}>确认</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(AddArchiveForm)
