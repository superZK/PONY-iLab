import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Select } from 'antd';
import BaseRangePicker from "../../../component/public/BaseRangePicker";
import './styles.css';
import moment from 'moment';


const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option

class ReportSentFormFilter extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      item,
      reportSentList,
    } = this.props;

    let obj = {};
    obj.queryType = '4';
    obj.dateType = item.dateType;
    if(item.date instanceof Array) {
      obj.startDate = moment(item.date[0]).format('YYYY-MM-DD');
      obj.endDate = moment(item.date[1]).format('YYYY-MM-DD');
    }
    reportSentList(obj)
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.queryType = '4';
        if(values.date instanceof Array) {
          values.startDate = moment(values.date[0]).format('YYYY-MM-DD');
          values.endDate = moment(values.date[1]).format('YYYY-MM-DD');
        }
        delete values.date
        this.props.reportSentList(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {item} = this.props;

    const formItemLayout = {
      labelCol: {
        xs: 5
      },
      wrapperCol: {
        xs: 15
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row style={{marginTop: 15}}>
          <Col xs={7} offset={1}>
            <FormItem
              {...formItemLayout}
              label='期间类型'>
              {getFieldDecorator('dateType', {
                initialValue: item ? item.dateType : '',
              })(
                <Select>
                  <Option value={"1"}>报告编制日期</Option>
                  <Option value={"2"}>报告审核通过日期</Option>
                  <Option value={"订单提交"}>订单提交日期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={7}>
            <FormItem
              {...formItemLayout}
              label='期间日期'>
              {getFieldDecorator('date', {
                initialValue: item ? item.date : [],
              })(
                <BaseRangePicker />
              )}
            </FormItem>
          </Col>
          <Col xs={5}>
            <FormItem wrapperCol={{span: 20}}>
              {getFieldDecorator('keyWord', {})(
                <Search placeholder="请输入关键字查询资质"/>
              )}
            </FormItem>
          </Col>
          <Col xs={2}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ReportSentFormFilter)
