  import React, { Component } from 'react';
  import { Upload, Button, Icon, message, Form, Modal, Input } from 'antd';
  import fetchData from '../../util/fetchGateway';

  /*
   * fileListLength  控制上传文件个数
   * editObject      获取到的数据
   * formKey         表单getFieldDecorator后的key值
   * url             上传的地址
   * visible         弹框
   * onFromSubmitSuccess   上传表单提交
   */

  class BaseUpload extends Component {
    constructor(props){
      super(props);
      this._handleUpload = this._handleUpload.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.normFile = this.normFile.bind(this);
      this._onRemove = this._onRemove.bind(this);
    }

    // onChange 的回调
    _handleUpload(info) {
      const {fileListLength} = this.props
      let fileList = info.fileList;

      // 说明：在这里控制文件数量等操作
      if (fileList.length > fileListLength) {
        fileList = fileList.slice(fileListLength)
      }

      if (info.file.status !== 'uploading') {
        console.log(info.file, fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }

      if (this.props.onChange) this.props.onChange(fileList)
    }

    // 可以把 onChange 的参数（如 event）转化为控件的值
    normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }

    // 表单提交
    handleSubmit(e){
      e.preventDefault();
      let {onFromSubmitSuccess} = this.props;
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          onFromSubmitSuccess(values)
        } else {
          return err;
        }
      })
    }

    _onRemove(e, key) {
      console.log(e, key);
    }

    render() {
      const {
        formKey,        // form 的key(id)
        editObject,     // 编辑时获取到文件
        url,            // 上传的地址 传入三个id
        visible,        // 弹框开启
        onCancel,       // 返回
        fileListLength, // 上传文件个数
      } = this.props

      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };

      return (
        <Modal
          style={{top:40}}
          width={'600px'}
          title={'上传文件'}
          visible={visible}
          onCancel={() => onCancel()}
          footer={null} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading">
              <Form onSubmit={this.handleSubmit}>
                <Form.Item
                  {...formItemLayout}
                  label={'上传文件'}>
                    {getFieldDecorator(formKey, {
                      valuePropName: 'fileList',
                      initialValue: editObject ? (editObject.formKey ? editObject.formKey : []) : [],
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload.Dragger
                        name="file"
                        action={url}
                        onChange={this._handleUpload}
                        onRemove={this._onRemove}
                        multiple>
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或拖动进行文件上传</p>
                        <p className="ant-upload-hint"> 最多可上传 {fileListLength} 个文件 </p>
                      </Upload.Dragger>
                    )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="margin-r" style={{marginLeft:10}}>确认</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      )
    }
  }

  export default Form.create()(BaseUpload);
