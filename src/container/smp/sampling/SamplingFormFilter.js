import React, { Component } from 'react';
import BaseForm from "../../../component/public/BaseForm";
import SampleManagementSetting from './column';
import moment from 'moment';

class SamplingFormFilter extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
  }

  componentDidMount() {
    this.props.samplingListList(moment().subtract(3,'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), null)
  }

  handleSubmitSuccess(values) {
    if (values.sampledDate) {
        values.sampledDate = values.sampledDate.map(_ => _.format('YYYY-MM-DD'));
        values.start = values.sampledDate[0];
        values.end = values.sampledDate[1];
      } else {
        values.start = '';
        values.end = '';
      }
      delete values.sampledDate
      this.props.samplingListList(values.start, values.end, values.key)
  }


  render() {

    const filterF = SampleManagementSetting.form.filterForm

    const obj = {};
    obj.sampledDate = [moment().subtract(3,'month'), moment()];

    return (
      <BaseForm
        setting = {filterF}
        colNum={1}
        onFormSubmitSuccess = {this.handleSubmitSuccess}
        submitTitleClass = {{marginLeft:10, transform: 'translate(-280px, -42px)'}}
        footerRule = {'确认'}
        editObject={obj}
      />
    )
  }
}

export default (SamplingFormFilter)
