import React, {Component} from 'react';
import TestItemAddEditDialog from './TestItemAddEditDialog';
import ResultRecordEditDialog from './ResultRecordEditDialog';
import ResultRecordAddDialog from './ResultRecordAddDialog';
import BaseTable from '../../public/BaseTable';
import AdvancedTable from '../../public/Table/AdvancedTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPreparedItems } from '../../../util/getPreparedItems';
import { Modal, Icon, Row, Col, Button } from 'antd';
import { analysisDataIndex, AddKeyForData } from '../../../util/treeUtils';

export default class ProgramEditDialog extends Component {
  state = {
      preventRepeat: '',
  }

  // 加载检测流程数据
  componentWillReceiveProps(prop) {
    // 阻止该函数的不断执行
    if(this.state.preventRepeat !== this.props.selectProgramId ){
      this.setState({
        preventRepeat:this.props.selectProgramId
      });
      this.props.loadTestFlowData(this.props.selectProgramId);
      this.props.resetCurrentItem();
    }
  }

  render(){
    // 父组件传递过来的props
    const {
      onRecordSubmitSuccess,
      onRecordCancel,
      editProgramItem,
      selectProgramId,
    } = this.props;
    const {
      testFlowData,
      handleType,
      preparedTestFlows,
      preparedTestFlowKeys,
      preparedRecordKeys,
      currentItem,
      preparedRecords,
      resultAddDataSource
    } = this.props;

    const {
      loadTestFlowData,
      addTestFlow,
      asyncAddTestFlow,
      asyncAddTestFlowByTable,
      preparedTestFlow,
      asyncDeleteItems,
      editTestFlow,
      asyncEditTestFlow,
      addRecordItem,
      asyncAddRecordItem,
      getCurrentItem,
      preparedRecord,
      asyncDeleteRecords,
      editRecordItem,
      asyncEditRecordItem,
      addTestFlowCancel,
      cancelDeleteItems,
      resetCurrentItem,
    } = this.props;

    const testFlowTableSetting = Setting.ProductSetting.table.productTestFlow;
    const recordTableSetting = Setting.ProductSetting.table.resultRecordStandard;
    const searchProgramFormSetting = Setting.ProductSetting.form.searchProgramForm;

    // 获取检测流程勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedTestFlow(rows, rowKeys);
    }

    // 获取检测流程点击项
    const handleTableSelect = (record) => {
      getCurrentItem(record);
    };

    // 获取结果项勾选项
    const handleRecordTablePrepare = (rows, rowKeys) => {
      preparedRecord(rows, rowKeys);
    }

    // 新增 + 编辑检测流程
    const TestItemAdd = () => {
      addTestFlow();
    }

    const TestItemEdit = () => {
      editTestFlow();
    }

    const handleSubmitSuccess = (values, testPlanName) => {
      if(testPlanName !== '全项' && handleType === '添加'){
        asyncAddTestFlowByTable(values, editProgramItem.id);
      }else{
        let c = {
          samplingPoint: values.samplingPoint,
          description: values.description,
          numReplicates: values.numReplicates,
          reportedNameZH: values.reportedNameZH,
          reportedNameEN: values.reportedNameEN,
          costPrice: values.costPrice,
          quotePrice: values.quotePrice,
          requiredVolume: values.requiredVolume,
          testInterval: values.testInterval,
        };
        let productTestId = editProgramItem.id;
        let testItemId = analysisDataIndex(values, 'testItem.id');
        let testStandardId = analysisDataIndex(values, 'testStandard.id');
        let testMethodId = analysisDataIndex(values, 'testMethod.id');
        let serviceGroupId = analysisDataIndex(values, 'serviceGroup.id');
        let measUnitId = analysisDataIndex(values, 'measUnit.id');
        if(handleType === '编辑'){
          c.id = preparedTestFlows[0].id;
          asyncEditTestFlow(c, productTestId, testItemId, testStandardId, testMethodId, serviceGroupId, measUnitId);
        }else if (handleType === '添加'){
          asyncAddTestFlow(c, productTestId, testItemId, testStandardId, testMethodId, serviceGroupId, measUnitId);
        }
      }
    }

    // 删除检测流程
    const TestItemDelete = () => {
      let hasChildren = false;
      for(let c of preparedTestFlows){
        if(c.resultRecordStandard && c.resultRecordStandard.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除检测项目",
        content: hasChildren ? "所选检测项目已经在质量标准、检测标准步骤、结果、报告中使用了，确认删除？" : "是否确认删除所选检测项目？",
        onOk(){ asyncDeleteItems( preparedTestFlows.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 新增结果项
    const handleRecordButtonAdd = (event) => {
      let flowId = currentItem.id;
      let testItemId = analysisDataIndex(currentItem, 'testItem.id');
      addRecordItem( flowId, testItemId );
    }

    const handleRecordButtonEdit = (event) => {
      editRecordItem();
    }

    const handleAddRecordSubmitSuccess = (resultArr) => {
      let pid = currentItem.id;
      asyncAddRecordItem(pid, resultArr);
    };

    // 编辑结果项
    const handleEditRecordSubmitSuccess = (values) => {
      let c = {
        name: values.name,
        nameEN: values.nameEN,
        reportName: values.reportName,
        reportNameEN: values.reportNameEN,
        samplingSite: values.samplingSite,
        numReplicates: values.numReplicates,
        max: values.max,
        min: values.min,
        places: values.places,
        orderNumber: values.orderNumber,
        indexScope: values.indexScope,
        lowControl1: values.lowControl1,
        lowControl2: values.lowControl2,
        lowControl3: values.lowControl3,
        lowControl4: values.lowControl4,
        lowControl5: values.lowControl5,
        highControl1: values.highControl1,
        highControl2: values.highControl2,
        highControl3: values.highControl3,
        highControl4: values.highControl4,
        highControl5: values.highControl5,
        specRule: values.specRule,
        description: values.description,
        descriptionEN: values.descriptionEN,
      };
      // let pid = preparedRecords[0].productTestFlowId;
      let pid = currentItem.id;
      let resultId = analysisDataIndex(values, 'resultType.id');
      let measUnitId = analysisDataIndex(values, 'measureUnit.id');
      let roundRuleId = analysisDataIndex(values, 'roundRule.id');
      let resultsFileId = analysisDataIndex(values, 'resultsFile.id');
      c.id = preparedRecords[0].id;
      asyncEditRecordItem(c, pid, resultId, measUnitId, roundRuleId, resultsFileId);
    }

    // 删除结果项
    const handleRecordButtonDelete = () => {
      let recordIds = preparedRecords.map((item) => (item.id));
      Modal.confirm({
        title: "删除结果项",
        content: "是否确认删除所选结果项？",
        onOk(){ asyncDeleteRecords(recordIds) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 取消操作
    const TestItemAddCanle = () => {
      addTestFlowCancel();
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      onRecordSubmitSuccess();
    }

    const handleCancel = (e)  => {
      e.preventDefault();
      onRecordCancel();
    }

    const prepareTestFlows = getPreparedItems(testFlowData, preparedTestFlowKeys);
    const prepareRecords = getPreparedItems(currentItem ? currentItem.resultRecordStandard : [], preparedRecordKeys);

    return(
      <div>
        <Modal
          width = '1300px'
          title = '检测项目'
          visible = {this.props.visible}
          onOk = {handleSubmit}
          onCancel = {handleCancel} >
          <div style={{ marginBottom: 16 }}>
            <SecurityButtonBox>
              <Button.Group>
                <Button key={'doc.product.management.testFlow.add'} disabled={false} icon="file-add" onClick={TestItemAdd} > 新增检测项目 </Button>
                <Button key={'doc.product.management.testFlow.edit'} disabled={!(preparedTestFlows.length === 1)} icon="edit" onClick={TestItemEdit} > 编辑检测项目 </Button>
                <Button key={'doc.product.management.testFlow.delete'} disabled={!preparedTestFlows.length} icon="delete" onClick={TestItemDelete} > 删除检测项目 </Button>
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
        <div style={{ marginBottom: 16 }}>
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
          data={currentItem.id ? AddKeyForData(currentItem.resultRecordStandard) : []}
        />
        </Modal>
        <TestItemAddEditDialog
          editType = {this.props.handleType}
          visible = {this.props.handleType === '添加' || this.props.handleType === '编辑'}
          onFormSubmit = {handleSubmitSuccess}
          onFormCancel = {TestItemAddCanle}
          editItem = {prepareTestFlows[0]}
          testProgram = {editProgramItem}
        />
        <ResultRecordEditDialog
          visible = {handleType === 'recordupdate'}
          onFormSubmit = {handleEditRecordSubmitSuccess}
          onRecordCancel = {TestItemAddCanle}
          editRecordItem = {prepareRecords[0]}
        />
        <ResultRecordAddDialog
          visible = {handleType === 'recordadd'}
          onRecordSubmitSuccess = {handleAddRecordSubmitSuccess}
          onRecordCancel = {TestItemAddCanle}
          preparedRecord = {preparedRecord}
          resultRecordAdd = {resultAddDataSource}
          preparedAddRecord = {preparedRecords}
        />
      </div>
    );
  }
}
