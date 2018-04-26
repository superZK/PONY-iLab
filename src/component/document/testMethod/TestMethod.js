import React, {Component} from 'react';
import { Row, Col, Spin, Button, Modal } from 'antd';
import TestMethodAddEditDialog from './TestMethodAddEditDialog';
import TestMethodOldVersion from './TestMethodOldVersion';
import SearchableTree from '../../public/SearchableTree';
import AdvancedTable from '../../public/Table/AdvancedTable';
import ConfirmModal from '../../public/ConfirmModal';
import Setting from '../../../config/index';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import { getPreparedItems, isAllActiveOrDisable } from '../../../util/getPreparedItems';
import BaseUpload from "../../public/BaseUpload";
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

export default class TestMethod extends Component{
  componentDidMount(){
    const {asyncLoadData} = this.props;
    asyncLoadData("1005", "检测方法");
  }

  componentWillReceiveProps(prop){
    const {asyncSelectItem} = this.props;
    if(prop.needReload){
      asyncSelectItem([this.props.selectedItemKey]);
    }
  }

  render(){
    const {
      isLoading,
      editType,
      categoryData,
      selectedItemKey,
      methodData,
      preparedItems,
      preparedKeys,//勾选项的key
      methodLinkedTestItems,
      modalTitle,
      modalInformation,
      oldVersions,
      // needReload,
      // uploadData,//上传文件 数据
    } = this.props;

    const {
      asyncSelectItem,
      addItem,
      editItem,
      asyncSaveItem,
      prepareItem,
      asyncDeleteItems,
      getTestItems,
      upItem,
      asyncUpVersion,
      activeItem,
      enableItem,
      asyncActiveEnable,
      discardItem,
      asyncDiscard,
      viewOldVersionItem,
      // importItem,
      // exportItem,
      cancelAddEdit,
      cancelDeleteItems,
      uploadModalTestMethod,//上传文件 弹框
      // uploadTestMethod,//上传文件 确认action
    } = this.props;

    const methodTableSetting = Setting.TestMethodSetting.table.testMethod;
    const testItemTableSetting = Setting.TestItemSetting.table.testItem;
    const searchFormSetting = Setting.TestMethodSetting.form.searchForm;

    const standardNo = preparedItems && preparedItems.length > 0 && preparedItems[0].standardNo;
    let reg=/[\\\/]/g;
    const uploadUrl = standardNo ? ('/upload/single?type=method&fileName=' + standardNo.replace(reg, '')) : '';
    const handlePDFUrl = standardNo ? ('/preview?type=method&fileName=' + standardNo.replace(reg, '')) : '';

    const openPreviewWindow = () => {
      window.open(handlePDFUrl, "_blank");
    }

    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return item.name;
    }

    // 获取检测方法表格勾选项
    const handleTablePrepare = (rows, rwoKeys) => {
      prepareItem(rows, rwoKeys);
    }

    // 获取检测方法表格点击项，并发送请求获取关联的检测项目
    const handleTableSelect = (record) => {
      getTestItems(record.id);
    };

    // 新增 + 编辑检测方法
    const handleTableButtonAdd = (event) => {
      addItem();
    }

    const handleTableButtonEdit = (event) => {
      editItem();
    }

    const handleEditFormSubmitSuccess = (values) => {
      let c = {
        code: values.code,
        name: values.name,
        nameEN: values.nameEN,
        methodReplace: values.methodReplace,
        methodIntro: values.methodIntro,
        qualificationType: values.qualificationType,
        effectiveDate: values.effectiveDate,
        expiryDate: values.expiryDate,
        standardNo: values.standardNo,
        nation: values.nation,
        standardStatus: values.standardStatus,
        inspectLimit: values.inspectLimit,
        inspectLimitDesc: values.inspectLimitDesc,
        publishUnit: values.publishUnit,
        publishDate: values.publishDate,
        releventUnit: values.releventUnit,
        publishNo: values.publishNo,
        officialSource: values.officialSource,
        methodNameZH: values.methodNameZH,
        methodNameEN: values.methodNameEN,
      };
      if(editType === '编辑'){
        c.id = preparedItems[0].id;
        c.version = preparedItems[0].version;
        let methodParentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].methodParent.id : '';
        asyncSaveItem(c, editType, selectedItemKey, methodParentId);
      }else if(editType === '新增'){
        asyncSaveItem(c, editType, selectedItemKey);
      }
    }

    // 删除检测方法
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedItems){
        if(c.resultRecord && c.resultRecord.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除检测方法",
        content: hasChildren ? "所选检测方法已经在质量标准、检测标准步骤、结果、报告中使用了，确认删除？" : "是否确认删除所选检测方法？",
        onOk(){ asyncDeleteItems((preparedItems && preparedItems.length > 0) && preparedItems.map((item) => (item.id))) },
        onCancel(){ cancelDeleteItems() },
      });
    }

    // 激活与禁用
    const handleTableButtonActive = (event) => {
      activeItem();
    }
    const handleTableButtonEnable = (event) => {
      enableItem();
    }

    const handleActiveEnable = () => {
      asyncActiveEnable(preparedItems.map((items) => {return items.id}));
    }

    // 检测方法升版
    const handleTableButtonUp = (event) => {
      upItem();
    }

    const handleUpVersionSuccess = () => {
      let parentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].methodParent.id : '';
      let methodId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].id : '';
      asyncUpVersion(parentId, methodId);
    }

    // 查看检测方法所有版本
    const viewOldVersion = (event) => {
      let parentId = (preparedItems && preparedItems.length > 0 ) ? preparedItems[0].methodParent.id : '';
      viewOldVersionItem(parentId);
    }

    // 废弃检测方法
    const handleDiscard = (event) => {
      asyncDiscard((preparedItems && preparedItems.length > 0 ) ? preparedItems[0].id : '');
    }

    // 取消操作
    const handleAddEditFormCancel = () => {
      cancelAddEdit();
    }

    const handleTableButtonDiscard = (event) => {
      discardItem();
    }

    // 导入与导出(未实现)
    // const handleTableButtonImport = (event) => {
    //   importItem();
    // }
    // const handleTableButtonExport = (event) => {
    //   exportItem();
    // }

    // 上传文件确认
    const handleSubmit = (values) => {
      cancelAddEdit();
    }

    const prepareItems = getPreparedItems(methodData, preparedKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;
    const isDiscard = isOnlyRadio && prepareItems[0].discard === true;
    // const isDisable = isOnlyRadio && prepareItems[0].activation === false;
    // const isActive = isOnlyRadio && prepareItems[0].activation === true;
    const notAllSame = isAllActiveOrDisable(prepareItems) === 'notAllSame';
    const allActive = isAllActiveOrDisable(prepareItems) === 'allActive';
    const allDisable = isAllActiveOrDisable(prepareItems) === 'allDisable';

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
              categoryData = {categoryData}
              selectedKeys = {["" + selectedItemKey]}
              onSelect={asyncSelectItem}
              isMatch={isMatch}
              renderTitle={renderTreeNodeTitle}
              />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{ margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 16 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.testMethod.management.add'} disabled={!selectedItemKey} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                        <Button key={'doc.testMethod.management.edit'} disabled={!(isOnlyRadio && !isDiscard)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                        <Button key={'doc.testMethod.management.delete'} disabled={!(isMultipleChoice && !isDiscard)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.testMethod.management.active'} disabled={!(isMultipleChoice && !notAllSame && allDisable)} icon="check-circle-o" onClick={handleTableButtonActive} > 激活 </Button>
                        <Button key={'doc.testMethod.management.disable'} disabled={!(isMultipleChoice && !notAllSame && allActive)} icon="close-circle-o" onClick={handleTableButtonEnable} > 禁用 </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button key={'doc.testMethod.management.upVersion'} disabled={!(isOnlyRadio)} icon="plus-circle-o" onClick={handleTableButtonUp} > 升版 </Button>
                        <Button key={'doc.testMethod.management.viewVersion'} disabled={!(preparedItems.length === 1)} icon="search" onClick={viewOldVersion} > 查看所有版本 </Button>
                      </Button.Group>
                        <Button style={{marginRight: 10}} key={'doc.testMethod.management.discard'} disabled={!(isOnlyRadio)} icon="exclamation-circle-o" onClick={handleTableButtonDiscard} > 废弃 </Button>
                      <Button.Group>
                        <Button key={'doc.testMethod.management.upload'} icon="upload" disabled={!(preparedItems.length === 1)} onClick={uploadModalTestMethod} > 上传文件 </Button>
                        <Button key={'doc.testMethod.management.download'} icon="eye-o" disabled={!(preparedItems.length === 1)} onClick={openPreviewWindow} > 查看文件 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                  <AdvancedTable
                    pagination={{pageSize:100, showQuickJumper:true}}
                    scroll={{x:0, y:125}}
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={true}
                    setting={methodTableSetting}
                    data={methodData}
                    colNum={'1'}
                    renderKey={['standardNo', 'methodNameZH']}
                    simpleSearchKey={[['名称','name'],['','methodNameZH'], ['标准号','code'],['','standardNo'], ['快捷码','shorthand']]}
                    avancedSearchForm={searchFormSetting}
                  />
                  <AdvancedTable
                    mode={'Simple'}
                    pagination={{pageSize:5, showQuickJumper:true}}
                    isExpanded={true}
                    setting={testItemTableSetting}
                    data={methodLinkedTestItems}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <TestMethodAddEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleAddEditFormCancel}
            editItem = {preparedItems[0]} />

          <ConfirmModal
            visible = {editType === 'upversion'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleUpVersionSuccess}
            onCancel = {handleAddEditFormCancel} />

          <ConfirmModal
            visible = {editType === 'activated_disabled'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleActiveEnable}
            onCancel = {handleAddEditFormCancel} />

          <ConfirmModal
            visible = {editType === 'discard'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleDiscard}
            onCancel = {handleAddEditFormCancel} />

          <TestMethodOldVersion
            visible = {editType === 'oldversion'}
            dataSource = {oldVersions}
            onConfirm = {handleAddEditFormCancel}
            onCancel = {handleAddEditFormCancel}
             />
          <BaseUpload
            visible={editType === '上传文件'}
            onCancel={() => cancelAddEdit()}
            editObject={prepareItems[0]}
            url={uploadUrl}
            fileListLength={1} //限制上传文件的数量
            onFromSubmitSuccess={handleSubmit}
            formKey={'upload'}/>
        </Spin>
      </div>
    );
  }
}
