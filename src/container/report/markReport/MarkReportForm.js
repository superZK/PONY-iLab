import React, { Component } from 'react';
import { Form } from 'antd';
// import SearchableSelector from '../../../component/public/SearchableSelector';
import MarkReportSetting from './column'
import BaseTable from "../../../component/public/BaseTable";
// import BaseCheckbox from "../../../component/public/BaseCheckbox";
import './styles.css';

class MarkReportForm extends Component {

  handleSelect(value, option) {
    this.props.markReportTemplateList(value)
  }

  // handleChange(e) {
  //   console.log(e);
  //   // this.props.rowsMarkreportQualification(e)
  // }


  render() {
    const {
      signatureData,                 // 签章表格数据
      reportTemplateData,            // 报告模板表格数据
      rowsMarkreportTemplate,         // 报告模板
      rowsMarkreportQualification,    // 签章
    } = this.props;

    // const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 18 },
    // };

    const TableSignature = MarkReportSetting.table.signature;
    const TableReport = MarkReportSetting.table.reportTemplate;

    // 报告模板
    const handleTablePrepare = (rows, rowKeys) => {
      rowsMarkreportTemplate(rows, rowKeys)
    }

    // 签章
    const handleTablePrepares = (rows, rowKeys) => {
      rowsMarkreportQualification(rows, rowKeys)
    }


    return (
      <Form>
        <div>
          <div style={{width: '47%', display: 'inline-block', float: 'left'}}>
            {/* <Form.Item
              {...formItemLayout}
              label='报告领域'>
                {getFieldDecorator('name', {
                  // initialValue: editObject ? (editObject.formKey ? editObject.formKey : []) : [],
                  // getValueFromEvent: this.normFile,
                })(
                  <SearchableSelector
                    options={{allowClear:true}}
                    disabled={false}
                    lazyMode={false}
                    onSelect={this.handleSelect.bind(this)}
                    url='/doc/categories/select/1018' />
                )}
            </Form.Item> */}
            {/* 报告模板 */}
            <BaseTable
              options={ {pagination: {size: 'small'}} }
              scroll={{y: 80}}
              isExpanded={false}
              onPrepare={handleTablePrepare}
              setting={TableReport}
              data={reportTemplateData}
            />
          </div>
          <div style={{width: '47%', display: 'inline-block', float: 'right'}}>
            {/* 签章 */}
            <BaseTable
              options={ {pagination: {size: 'small'}} }
              scroll={{y: 80}}
              isExpanded={false}
              onPrepare={handleTablePrepares}
              setting={TableSignature}
              data={signatureData}
            />
            {/* <Form.Item
              {...formItemLayout}
              label='签章'>
                {getFieldDecorator('signetIds', {
                  // initialValue: editObject ? (editObject.formKey ? editObject.formKey : []) : [],
                })(
                <BaseCheckbox
                  onChange={this.handleChange.bind(this)}
                  url='/report/signet/query' />
                )}
            </Form.Item> */}
          </div>
          <div style={{clear: 'both'}}></div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(MarkReportForm)
