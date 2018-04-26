import React, { Component } from 'react';
import {Row, Col, Form, Input, Button, Radio} from 'antd';
import BaseRangePicker from '../../../component/public/BaseRangePicker';
import moment from 'moment'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class OfferFilter extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.start = moment(values.date && values.date[0]).format('YYYY-MM-DD');
        values.end = moment(values.date && values.date[1]).format('YYYY-MM-DD');
        delete values.date;
        this.props.offerList(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: 6
      },
      wrapperCol: {
        xs: 16
      }
    }

    const item = [];

    return (
      <Form>
        <Row style={{marginTop: 10}}>
          <Col xs={6}>
            <FormItem
               {...formItemLayout}
               label='客户名称'
              className={'formItem-margin-bottom'}>
              {getFieldDecorator('customer', {
                initialValue: item ? item.customer : '',
              })(
                <Input placeholder="请输入客户名称" />
               )}
            </FormItem>
          </Col>
          <Col xs={6}>
            <FormItem
              {...formItemLayout}
              label='单据编号'
              className={'formItem-margin-bottom'} >
              {getFieldDecorator('code', {
                initialValue: item ? item.code : '',
              }
            )(
              <Input placeholder="请输入单据编号" />
            )}
            </FormItem>
          </Col>
          <Col xs={6}>
            <FormItem
              {...formItemLayout}
              label='制单日期'
              className={'formItem-margin-bottom'} >
              {getFieldDecorator('date', {
                initialValue: item ? item.date : '',
              }
            )(
              <BaseRangePicker />
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

export default Form.create()(OfferFilter)
