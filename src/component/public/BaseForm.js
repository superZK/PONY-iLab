import React, { Component } from 'react';
import { Button, Form, Row, Col } from 'antd';
import { analysisDataIndex } from '../../util/treeUtils';

class BaseForm extends Component {
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    // this.renderExpandedRow = this.renderExpandedRow.bind(this);
    // this.handleExpand = this.handleExpand.bind(this);
  }

  // 表单数据重置
  componentWillReceiveProps(nextProps){
    if(typeof(this.props.visible) === 'boolean'){
      if (!this.props.visible && nextProps.visible){
        this.props.form.resetFields();
      }
    }
  }

  handleSubmit(e){
    e.preventDefault();
    let {onFormSubmitSuccess, onFormSubmitFail} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(onFormSubmitSuccess) {onFormSubmitSuccess(values)};
      } else {
        if(onFormSubmitFail) {onFormSubmitFail(err, values)};
      }
    });
  }

  render() {
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

    const {
      editObject,//被操作的对象
      onCancel,//表格取消按钮
      colNum,//弹性布局Col倍数，Row为24，Col底值为8
      visible,//modal打开或关闭控制状态，用于表单数据重置
    } = this.props;

    const { getFieldDecorator, resetFields } = this.props.form

    const renderItem = (item) => {
      let r = item.rules ? item.rules : [];
      return (
        <Col span={8*colNum} className={item.formItemColStyle}>
          <Form.Item
            {...formItemLayout}
            label={item.label}
            hasFeedback
            className={'formItem-margin-bottom'}
          >
          {getFieldDecorator(
            item.key,
            // 取消DatePick的默认值
            item.component.props.prefixCls === "ant-calendar" ? {
              rules: r,
            } : {
              rules: r,
              // initialValue: editObject ? (editObject[item.key] ? editObject[item.key] : '') : ''
              initialValue: editObject ? (analysisDataIndex(editObject, item.key) ? analysisDataIndex(editObject, item.key) : '') : ''
            }
          )(item.component)}
          </Form.Item>
        </Col>
      );
    };

    const {submitTitle, items} = this.props.setting;

    const renderForm = (itemConfig) => {
      if(itemConfig)
        return itemConfig.map(item => renderItem(item));
    }

    const renderExtraItem = (extraItem) => {
      if(extraItem){
        return (
          <Col span={8*colNum} className={extraItem.formItemColStyle}>
            <Form.Item
              hasFeedback
              className={'formItem-margin-bottom'}
            >
              {extraItem}
            </Form.Item>
          </Col>
        );
      }
    }

    const switchFooter = (footerRule) => {
      switch(footerRule){
        case 'null':
          return null;
        case '确认':
          return (
            <Form.Item style={{marginBottom: '5px'}}>
              <Button type="primary" htmlType="submit" className="margin-r" style={this.props.submitTitleClass}>{submitTitle}</Button>
            </Form.Item>
          );
        case '取消':
          return (
            <Form.Item style={{marginBottom: '5px'}}>
              <Button onClick={onCancel} className="margin-r">取消</Button>
            </Form.Item>
          );
        case '确认与取消':
        default:
          return (
            <Form.Item style={{marginBottom: '5px'}}  >
              <Button type="primary" htmlType="submit" className="margin-r" style={{marginLeft:10}}>{submitTitle}</Button>
              <Button onClick={onCancel} className="margin-r">取消</Button>
            </Form.Item>
          );
      }
    }

    return (
      <Form onSubmit={this.handleSubmit} style={this.props.style} >
        <Row gutter={16}>
          {renderForm(items)}
          {this.props.extraItem && this.props.extraItem.length > 0 ? this.props.extraItem.map((formItem) => renderExtraItem(formItem)) : null}
        </Row>
        {switchFooter(this.props.footerRule)}
        {/* {this.props.hideCancel === true ?
        <Form.Item style={{marginBottom: '5px'}}>
          <Button type="primary" htmlType="submit" className="margin-r" style={this.props.submitTitleClass}>{submitTitle}</Button>
        </Form.Item> :
        <Form.Item style={{marginBottom: '5px'}}  >
          <Button type="primary" htmlType="submit" className="margin-r" style={{marginLeft:10}}>{submitTitle}</Button>
          <Button onClick={onCancel} className="margin-r">取消</Button>
        </Form.Item>} */}
      </Form>
    );
  }
}
export default Form.create()(BaseForm);
