import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import SearchableSelector from '../../../component/public/SearchableSelector';

const FormItem = Form.Item;

class MaterialForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmits = this.handleSubmits.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.materialSave(values, this.props.materialClick.id, values.locationId, values.unitId, values.number, false);
        if (this.props.materialSave) {
          this.props.item = '';
        };
      }
    });
  }
  handleSubmits(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.materialSave(values, this.props.materialClick.id, values.locationId, values.unitId, values.number, true);
        if (this.props.materialSve) {
          this.props.item = '';
        };
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const {item, materialSave} = this.props;

    const formItemLayouts = {
      labelCol: {
        xs: 6
      },
      wrapperCol: {
        xs: 16
      }
    }

    return (
      <Form>
        <Row style={{margin: '10px 0'}}>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='订单编号'>
            {getFieldDecorator('ordNo', {
              initialValue: item ? item.ordNo : '',
            })( <Input placeholder='请输入订单编号' /> )}
          </FormItem>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='物料编号'>
            {getFieldDecorator('code', {
              initialValue: item ? item.code : '',
            })( <Input placeholder='请输入物料编号' /> )}
          </FormItem>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='存放位置'>
            {getFieldDecorator('locationId', {
              initialValue: item ? item.locationId : '',
              rules: [{required: true, message: '请选择存放位置'}]
            })(
              <SearchableSelector
                options={{allowClear: true}}
                placeholder='请选择存放位置'
                url='/loc/location/select' />
            )}
          </FormItem>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='CAS'>
            {getFieldDecorator('cas', {
              initialValue: item ? item.cas : '',
            })(<Input placeholder="请输入CAS" />)}
          </FormItem>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='批号'>
            {getFieldDecorator('batchNo', {
              initialValue: item ? item.batchNo : '',
            })(<Input placeholder="请输入批号" />)}
          </FormItem>
          <Row>
            <Col span={14}>
              <FormItem
                className={'formItem-margin-bottom'}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 12 }}
                label='规格'>
                {getFieldDecorator('spec', {
                  initialValue: item ? item.spec : '',
                  rules: [{required: true, message: '请输入规格'}]
                })(<Input placeholder="请输入规格" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem wrapperCol={{ span: 10 }} className={'formItem-margin-bottom'}>
                {getFieldDecorator('unitId', {
                  initialValue: item ? item.unitId : '',
                  rules: [{required: true, message: '请选择度量单位'}]
                })(
                  <SearchableSelector
                    options={{allowClear: true}}
                    placeholder='请选择度量单位'
                    url='/doc/measunit/select'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            className={'formItem-margin-bottom'}
            {...formItemLayouts}
            label='入库数量'>
            {getFieldDecorator('number', {
              initialValue: item ? item.number : '',
              rules: [{required: true, message: '请输入入库数量'}, {pattern: '^[0-9]+$',message: '请输入正确格式入库数量' }]
            })(<Input placeholder="请输入入库数量" />)}
          </FormItem>
          <Col offset={6}>
            <Button style={{margin: '10px 10px 0 0'}} type="primary" onClick={this.handleSubmit}>试剂入库</Button>
            <Button type="primary" onClick={this.handleSubmits}>标准物质入库</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(MaterialForm)
