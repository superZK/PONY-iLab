import React, { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import BaseCheckboxAll from "../../../component/public/BaseCheckboxAll";
import './styles.css';

const FormItem = Form.Item;

class ReportSentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disEmail: true,
      disExpress: true,
      disInvoice: true,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
  }

  // 快递交付
  // handleExpress(e) {
  //   e.target.checked ?
  //   this.setState({disExpress: false}) :
  //   this.setState({disExpress: true})
  //   if (e.target.checked === false) {
  //     const delivery = ''
  //     this.props.form.setFieldsValue({expressNumber: delivery})
  //   }
  // }

  handleSetState(val, dataVal, dis) {
    let v = val.join(',');
    ((v || '').indexOf(dataVal) >= 0) ?
    this.setState({[dis]: false}) :
    this.setState({[dis]: true})
  }

  // 交付方式
  handleChangeCheckbox(value) {
    this.handleSetState(value, '510501', 'disEmail');
    this.handleSetState(value, '510502', 'disExpress');
    this.props.reportMethodList(value);
  }

  // 交付物
  handleChange(value) {
    this.handleSetState(value, '510002', 'disInvoice');
    this.props.reportGoodsList(value);
  }

  render() {
    const { disEmail, disExpress, disInvoice } = this.state

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Form>
        <Row>
          <Col xs={5}>
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 10 }}
              label='交付方式'>
              {getFieldDecorator('methodList', {})(
                <BaseCheckboxAll
                  AllCheckBox
                  onChange={this.handleChangeCheckbox}
                  url='/doc/categories/type/1022' />
              )}
            </FormItem>
          </Col>
          <Col xs={5} style={{borderRight: '1px dashed #49b9ee73', borderLeft: '1px dashed #49b9ee73'}}>
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 9 }}
              label='交付物'>
                {getFieldDecorator('goodsList', {})(
                <BaseCheckboxAll
                  onChange={this.handleChange}
                  AllCheckBox
                  url='/doc/categories/type/1021' />
                )}
            </FormItem>
          </Col>
          <Col xs={12}>
            {!disEmail ?
              <FormItem
                {...formItemLayout}
                label='邮箱地址'>
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: '请输入邮箱正确格式！',
                    }, {required: !disEmail, message: '请输入邮箱号'}]
                  })(
                  <Input placeholder='请输入邮箱号' disabled={disEmail} type='text' />
                  )}
              </FormItem> : ''}
            {!disExpress ?
              <FormItem
                {...formItemLayout}
                label='快递单号'>
                  {getFieldDecorator('expressNumber', {
                    rules: [{pattern: '^[a-zA-Z0-9]+$',message: '请输入字母或数字组合形式！'
                  }, {required: !disExpress, message: '请输入快递单号'}]
                  })(
                  <Input placeholder='请输入快递单号' disabled={disExpress} type='text' />
                  )}
              </FormItem> : ''}
            {!disInvoice ?
              <FormItem
              {...formItemLayout}
              label='发票'>
                {getFieldDecorator('invoice', {
                  rules: [{required: true, message: '请输入发票信息',}]
                })(
                <Input placeholder='请输入发票信息' type='text' />
                )}
            </FormItem> : ''}
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ReportSentForm)
