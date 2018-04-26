import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sampleManagementAction from '../../../action/smp/sampling/sampleManagementAction';
import { Spin, Button, Row, Col, Modal, } from 'antd';
import { isAllActiveOrDisable } from '../../../util/getPreparedItems';

import SecurityButtonBox from '../../../component/public/SecurityButtonBox';
import AdvancedTable from '../../../component/public/Table/AdvancedTable';

import SampleManagementSetting from './column'
import SamplingFormFilter from './SamplingFormFilter'
import AddSampling from './AddSampling'
import moment from 'moment';


class SampleManagement extends Component{

  render() {
    const {
      isLoading,
      editType,
      sampleListData,//抽样单列表数据
      sampleListRows,//列表rows
      sampleListRowsKey,//列表rowsKey
      sampleClick,//列表点击项
    } = this.props;

    const {
      samplingListKey,//列表rows
      getCurrentSampling,//列表点击项
      samplingListList,//列表搜索接口
      addSampling,//新增弹框
      editSampling,//编辑弹框
      samplingAdd,//新增
      samplingActive,//激活
      samplingUnActive,//禁用
      cancelSample,//弹框返回
    } = this.props

    const sampleTableSetting = SampleManagementSetting.table.task; // 定义搜索表单

    const isMultipleChoice = (sampleListRowsKey.length >= 1) || (sampleClick && sampleClick.id) ? true : false;  // 判断删除disabled
    const notAllSame = (isAllActiveOrDisable((sampleListRows && sampleListRows.length>0) ? sampleListRows : [sampleClick], 'available') === 'notAllSame');
    const allActive = (isAllActiveOrDisable((sampleListRows && sampleListRows.length>0) ? sampleListRows : [sampleClick], 'available') === 'allActive');
    const allDisable = (isAllActiveOrDisable((sampleListRows && sampleListRows.length>0) ? sampleListRows : [sampleClick], 'available') === 'allDisable');

    const disEdit = (sampleListRowsKey.length === 1) || (sampleClick && sampleClick.id) ? true : false;

    // 激活 / 禁用
    const handleActive = () => {
      Modal.confirm({
        title: '激活',
        content: '是否激活当前选中的抽样单？',
        onOk() {
          samplingActive((sampleListRowsKey && sampleListRowsKey.length > 0) ? sampleListRowsKey : [sampleClick.id + ''])
        },
        onCancel() {cancelSample()}
      })
    }
    const handleUnActive = () => {
      Modal.confirm({
        title: '禁用',
        content: '是否禁用当前选中的抽样单？',
        onOk() {
          samplingUnActive((sampleListRowsKey && sampleListRowsKey.length > 0) ? sampleListRowsKey : [sampleClick.id + ''])
        },
        onCancel() {cancelSample()}
      })
    }

    // 列表选中项
    const handleTableSelect = (record) => {
      getCurrentSampling(record)
      if (record) {
        record.operateDate = moment(record.operateDate).format('YYYY-MM-DD')
      }
    }
    // 列表rows
    const handleTablePrepare = (rows, rowKeys) => {
      samplingListKey(rows, rowKeys);
      if (rows.length > 0) {
        (rows || []).map(item => {
          return item.operateDate = moment(item.operateDate).format('YYYY-MM-DD')
        })
      }
    }

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div className="panel panel-info" style={{margin:0}}>
            <div className="panel-heading" style={{height:65}}>
              <SamplingFormFilter
                samplingListList={samplingListList}
              />
            </div>
            <div className="panel panel-info" style={{margin:0}}>
              <div className="panel-body">
                <Row style={{marginBottom: '10px' }}>
                  <Col span={19} offset={1}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'smp.sampling.management.add'} onClick={() => addSampling()} icon="file-add" > 新增 </Button>
                        <Button key={'smp.sampling.management.edit'} disabled={!(disEdit)} onClick={() => editSampling()} icon="edit" > 编辑 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'smp.sampling.management.active'} icon="check-circle-o" onClick={handleActive} disabled={!(isMultipleChoice && !notAllSame && allDisable)}> 激活 </Button>
                        <Button key={'smp.sampling.management.unactive'} icon="close-circle-o" onClick={handleUnActive} disabled={!(isMultipleChoice && !notAllSame && allActive)} > 禁用 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </Col>
                </Row>
                <AdvancedTable
                  pagination={{pageSize:15, showQuickJumper:true}}
                  onSelect={handleTableSelect}
                  onPrepare={handleTablePrepare}
                  isExpanded={false}
                  setting={sampleTableSetting}
                  data={sampleListData}
                  colNum={'1'}
                  simpleSearchKey={[['编号','code'], ['地点','address'], ['基数','base'], ['被抽样单位','entityUnder'], ['','entityUnderPhone'], ['','entityUnderDistrict'], ['','entity'], ['','operateBy']]}
                  avancedSearchForm={false}
                />
              </div>
            </div>
          </div>
          <AddSampling
            visible={editType === '新增' || editType === '编辑'}
            onCancel={() => cancelSample()}
            onFormSubmit={samplingAdd}
            editType={editType}
            editRows={sampleListRows[0]}//传过去的表格rows
            sampleClick={sampleClick}//表格点击项
           />
        </Spin>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.sampleManagement.get('isLoading'),
    editType: state.sampleManagement.get('editType'),
    sampleListData: state.sampleManagement.get('sampleListData'),
    sampleListRows: state.sampleManagement.get('sampleListRows'),
    sampleListRowsKey: state.sampleManagement.get('sampleListRowsKey'),
    sampleClick: state.sampleManagement.get('sampleClick'),
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(sampleManagementAction, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SampleManagement)
