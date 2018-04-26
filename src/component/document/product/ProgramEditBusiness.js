import React, {Component} from 'react';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { Modal, Button } from 'antd';
import BaseTable from '../../public/BaseTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import { analysisDataIndex } from '../../../util/treeUtils';

export default class ProgramEditBusiness extends Component {
  render(){
    const {
      testFlowData,
      preparedTestFlows,
      preparedTestFlowKeys,
      currentItem,
      preparedRecords,
    } = this.props;

    const {
      addTestFlow,
      preparedTestFlow,
      asyncDeleteItems,
      editTestFlow,
      getCurrentItem,
      cancelDeleteItems,
      addRecordItem,
      editRecordItem,
      asyncDeleteRecords,
      preparedRecord,
      addScopeRecord,//查询可添加结果项
    } = this.props;

    const testFlowTableSetting = Setting.ProductSetting.table.productTestFlow;
    const searchProgramFormSetting = Setting.ProductSetting.form.searchProgramForm;
    const recordTableSetting = Setting.ProductSetting.table.resultRecordStandard;

    // disabled
    const disEdit = preparedTestFlowKeys && preparedTestFlowKeys.length === 1;
    const disDel = preparedTestFlowKeys && preparedTestFlowKeys.length >= 1;

    // 获取检测流程勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedTestFlow(rows, rowKeys);
    }

    // 获取检测流程点击项
    const handleTableSelect = (record) => {
      getCurrentItem(record);
    };

    // 新增 + 编辑检测流程
    const TestItemAdd = () => {
      addTestFlow();
    }

    const TestItemEdit = () => {
      editTestFlow();
    }

    // 删除检测流程
    const TestItemDelete = () => {
      Modal.confirm({
        title: "删除检测项目",
        content: "是否确认删除所选检测项目？",
        onOk(){ asyncDeleteItems( preparedTestFlows.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 查询结果可添加结果项
    const handleRecordButtonAdd = (event) => {
      const testItemId = analysisDataIndex(currentItem, 'testItem.id');
      addScopeRecord(currentItem.id, testItemId);
    }

    const handleRecordButtonEdit = (event) => {
      editRecordItem();
    }

    // 删除结果项
    const handleRecordButtonDelete = () => {
      let recordIds = preparedRecords.map((item) => (item.id));
      Modal.confirm({
        title: "删除结果项",
        content: "是否确认删除所选结果项？",
        onOk(){ asyncDeleteRecords(recordIds, currentItem) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 获取结果项勾选项
    const handleRecordTablePrepare = (rows, rowKeys) => {
      preparedRecord(rows, rowKeys);
    }

    return(
      <div>
        <div style={{ marginBottom: '10px' }}>
          <SecurityButtonBox>
            <Button.Group>
              <Button key={'doc.product.management.testFlow.add'} disabled={false} icon="file-add" onClick={TestItemAdd} > 新增检测项目 </Button>
              <Button key={'doc.product.management.testFlow.edit'} disabled={!(disEdit)} icon="edit" onClick={TestItemEdit} > 编辑检测项目 </Button>
              <Button key={'doc.product.management.testFlow.delete'} disabled={!(disDel)} icon="delete" onClick={TestItemDelete} > 删除检测项目 </Button>
            </Button.Group>
          </SecurityButtonBox>
        </div>
        <AdvancedTable
          mode={'Search'}
          pagination={{pageSize:100, showQuickJumper:true}}
          scroll={{x:0, y:125}}
          onSelect={handleTableSelect}
          onPrepare={handleTablePrepare}
          isExpanded={true}
          setting={testFlowTableSetting}
          data={testFlowData}
          colNum={'1'}
          simpleSearchKey={[['名称','testItem.name'],['','testMethod.name'],['','testStandard.name'],['','testMethod.methodNameZH'], ['标准号','testMethod.standardNo'], ['','testStandard.code'], ['快捷码','shorthand']]}
          avancedSearchForm={searchProgramFormSetting}
        />
        <div style={{ margin: '16px 0' }}>
          <SecurityButtonBox>
            <Button.Group>
              <Button key={'doc.product.management.resultRecord.add'} disabled={!(currentItem && currentItem.id)} icon="file-add" onClick={handleRecordButtonAdd} > 新增结果项 </Button>
              <Button key={'doc.product.management.resultRecord.edit'} disabled={!(preparedRecords.length === 1)} icon="edit" onClick={handleRecordButtonEdit} > 编辑结果项 </Button>
              <Button key={'doc.product.management.resultRecord.delete'} disabled={!preparedRecords.length} icon="delete" onClick={handleRecordButtonDelete} > 删除结果项 </Button>
            </Button.Group>
          </SecurityButtonBox>
        </div>
        <BaseTable
          options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
          onPrepare={handleRecordTablePrepare}
          isExpanded={true}
          setting={recordTableSetting}
          data={currentItem.id ? currentItem.productTestScopeResult : []}
        />
      </div>
    );
  }
}
