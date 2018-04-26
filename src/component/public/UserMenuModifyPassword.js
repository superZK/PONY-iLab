import React, {Component} from 'react';
import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

class ModifyPassword extends Component {
  state = {
    confirmDirty: false,
  };

  componentWillReceiveProps(nextProps){
    if(!this.props.visible && nextProps.visible)
      this.props.form.resetFields();
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { onFormSubmitSuccess, onFormSubmitFail, onFormCancel } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          onFormSubmitSuccess(values);
        } else {
          onFormSubmitFail(err, values);
        }
      });
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onFormCancel();
    }

    return (
      <Modal
        title = '修改密码'
        visible = {this.props.visible}
        onOk = {handleSubmit}
        onCancel = {handleCancel}
      >
        <Form onSubmit={handleSubmit}>
          <FormItem
              {...formItemLayout}
              label="旧密码"
              hasFeedback
            >
            {getFieldDecorator('originalPassword', {
              rules: [{
                required: true, message: '请输入旧密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入新密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认新密码"
            hasFeedback
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认新密码',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
        </Form>
      </Modal>
      
    );
  }
}
export default Form.create()(ModifyPassword);