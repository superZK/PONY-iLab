import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Select } from 'antd';
import BaseRangePicker from "../../../component/public/BaseRangePicker";
import SearchableSelector from '../../../component/public/SearchableSelector';
import './styles.css';
import moment from 'moment';


const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option

class ReportArchiveFilter extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      item,
      filterArchivedData,
    } = this.props;

    let obj = {};
    obj.queryType = item.queryType;
    obj.dateType = item.dateType;
    if(item.date instanceof Array) {
      obj.startDate = moment(item.date[0]).format('YYYY-MM-DD');
      obj.endDate = moment(item.date[1]).format('YYYY-MM-DD');
    }
    filterArchivedData(obj)
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.date instanceof Array) {
          values.startDate = moment(values.date[0]).format('YYYY-MM-DD');
          values.endDate = moment(values.date[1]).format('YYYY-MM-DD');
        }
        delete values.date
        this.props.filterArchivedData(values)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {item} = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row style={{marginTop: 15}}>
          <Col xs={4}>
            <FormItem
              label='归档位置'
              wrapperCol={{span: 16}}
              labelCol={{span: 8}} >
              {getFieldDecorator('location', {
                initialValue: item ? item.location : '',
              })(
                <SearchableSelector
      						options={{allowClear: true}}
      						placeholder='请选择存放位置'
      						url='/loc/sLocation/query/report' />
              )}
            </FormItem>
          </Col>
          <Col xs={3} offset={1}>
            <FormItem wrapperCol={{span: 24}} >
              {getFieldDecorator('queryType', {
                initialValue: item ? item.queryType : '',
              })(
                <Select >
                  <Option value={"5"}>未归档</Option>
                  <Option value={"6"}>已归档</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={3} offset={1}>
            <FormItem wrapperCol={{span: 24}} >
              {getFieldDecorator('dateType', {
                initialValue: item ? item.dateType : '',
              })(
                <Select>
                  <Option value={"1"}>报告编制日期</Option>
                  <Option value={"5"}>归档日期</Option>
                  <Option value={"订单提交日期"}>订单提交日期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={4} offset={1}>
            <FormItem wrapperCol={{span: 24}}>
              {getFieldDecorator('date', {
                initialValue: item ? item.date : [],
              })(
                <BaseRangePicker />
              )}
            </FormItem>
          </Col>
          <Col xs={3} offset={1}>
            <FormItem wrapperCol={{span: 24}}>
              {getFieldDecorator('keyWord', {})(
                <Search
      						placeholder="请输入关键字查询资质"
      					/>
              )}
            </FormItem>
          </Col>
          <Col xs={2} offset={1}>
            <Button type="primary" htmlType="submit">查询</Button>
            {/* <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button> */}
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(ReportArchiveFilter)
