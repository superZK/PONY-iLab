import React, {Component} from 'react';
import { Row, Col, Spin, Button, Modal } from 'antd';
import UnitEditDialog from './UnitEditDialog';
import TransformUnitEditDialog from './TransformUnitEditDialog';
import TransformUnitAddDialog from './TransformUnitAddDialog';
import SearchableTree from '../../public/SearchableTree';
import BaseTable from '../../public/BaseTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import Setting from '../../../config/index';
import { getPreparedItems } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class MeasureUnitTable extends Component{

  componentDidMount(){
    const {asyncLoadData} = this.props;
    asyncLoadData("1001", "度量单位");
  }

  // 删除版本后重新调用一遍查询接口
  componentWillReceiveProps(prop){
    const {asyncSelectUnit} = this.props;
    if(prop.needReload){
      asyncSelectUnit([this.props.selecctedUnitKey]);
    }
  }

  render(){
    const {
      isLoading,
      editType,
      categoryData,
      selecctedUnitKey,
      preparedUnits,
      preparedKeys,
      preparedTransformKeys,
      currentUnit,
      unitData,
      preparedTransforms,
      needReload,
    } = this.props;

    const {
      asyncSelectUnit,
      addUnit,
      asyncSaveUnit,
      prepareUnit,
      editUnit,
      asyncDeleteUnits,
      getCurrentUnit,
      addTransformUnit,
      asyncSaveTransformUnit,
      preparedTransform,
      editTransformUnit,
      asyncEditTransformUnit,
      asyncDeleteTransforms,
      cancelAddUnit,
      cancelEditUnit,
      cancelDeleteUnits,
      cancelEditTransformUnit,
    } = this.props;

    const unitTableSetting = Setting.UnitSetting.table.unit;
    const transformTableSetting = Setting.UnitSetting.table.transform;

    // 搜索树的匹配规则
    const isMatch = (item, searchValue) => {
      return (
        (item.name && item.name.includes(searchValue))
        || (item.code && item.code.includes(searchValue))
        || (item.shorthand && item.shorthand.includes(searchValue))
      );
    }

    const renderTreeNodeTitle = (item) => {
      return item.code + "-" + item.name;
    }

    // 获取度量单位表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      prepareUnit(rows, rowKeys);
    }

    // 获取转换关系表格勾选项
    const transformTablePrepare = (rows, rowKeys) => {
      preparedTransform(rows, rowKeys);
    }

    // 获取度量单位表格点击项
    const handleTableSelect = (record, index) => {
      getCurrentUnit(record);
    };

    //更改单击行的样式
    const changeRowClickClass = (record, index) => {
      if(this.props.currentUnit && this.props.currentUnit.id === record.id){
        return 'rowClickClass';
      }
    }

    //新增+编辑度量单位
    const handleTableButtonAdd = (event) => {
      addUnit();
    }

    const handleTableButtonEdit = (event) => {
      editUnit();
    }

    const handleEditFormSubmitSuccess = (values) => {
      let c = {
        id: values.id,
        name: values.name,
        nameEN: values.nameEN,
        code: values.code,
        description: values.description,
        modifier: values.modifier,
        modificationTime: values.modificationTime,
        securityGroup: values.securityGroup,
        audit: values.audit,
      };
      if(editType !== '新增')
        c.id = preparedUnits[0].id;
      asyncSaveUnit(c, editType, selecctedUnitKey);
    }

    // 删除度量单位
    const handleTableButtonDelete = () => {
      let hasChildren = false;
      for(let c of preparedUnits){
        if(c.conversUnit && c.conversUnit.length > 0){
          hasChildren = true;
          break;
        }
      }
      Modal.confirm({
        title: "删除度量单位",
        content: hasChildren ? "所选单位度量单位已经在检测项目、结果录入、检测方法步骤中使用了，确认删除？" : "确认删除所选度量单位？",
        onOk(){ asyncDeleteUnits(preparedUnits.map((item) => (item.id))) },
        onCancel(){ cancelDeleteUnits() },
      });
    }

    // 新增转换关系
    const handleTransformButtonAdd = (event) => {
      addTransformUnit();
    }

    const handleAddTransformSubmitSuccess = (values) => {
      let unitcode = currentUnit.id;
      let typeid = selecctedUnitKey;
      asyncSaveTransformUnit(unitcode, typeid);
    }

    // 编辑转换关系
    const handleTransformButtonEdit = (event) => {
      editTransformUnit();
    }

    const handleEditTransformSubmitSuccess = (values) => {
      let c = {
        conversFactors: values.conversFactors,
        offset: values.offset,
        costumFormula: values.costumFormula,
      };
      c.id = preparedTransforms[0].id;
      let unitcode = preparedTransforms[0].unit.id;
      let objunitcode = preparedTransforms[0].targetUnit.id;
      asyncEditTransformUnit(c, unitcode, objunitcode);
    }

    // 删除转换关系
    const handleTransformButtonDelete = () => {
      let conversId = preparedTransforms.map((item) => (item.id));
      let unitId = preparedTransforms.map((item) => (item.unitid));
      Modal.confirm({
        title: "删除度量单位转换关系",
        content: "确认删除所选度量单位转换关系？",
        onOk(){ asyncDeleteTransforms(conversId, unitId) },
        onCancel(){ cancelDeleteUnits() },
      });
    }

    // 取消操作（有时间修改复用一个）
    const handleEditFormCancel = () => {
      cancelEditUnit();
    }

    const handleAddFormCancel = () => {
      cancelAddUnit();
    }

    const handleEditTransformCancel = () => {
      cancelEditTransformUnit();
    }

    const prepareItems = getPreparedItems(unitData, preparedKeys);
    const prepareTransforms = getPreparedItems(currentUnit ? currentUnit.conversUnit : [], preparedTransformKeys);
    const isOnlyRadio = prepareItems.length === 1;
    const isMultipleChoice = prepareItems.length >= 1;

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <Row gutter={16} style={{marginLeft: 0, marginRight: 0}}>
            <Col span={4}>
              <SearchableTree
              categoryData = {categoryData}
              selectedKeys = {["" + selecctedUnitKey]}
              onSelect={asyncSelectUnit}
              isMatch={isMatch}
              renderTitle={renderTreeNodeTitle}
              />
            </Col>
            <Col span={20}>
              <div className="panel panel-info" style={{margin:0}}>
                <div className="panel-body">
                  <div style={{ marginBottom: 10 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.measureUnit.management.unit.add'} disabled={!selecctedUnitKey} icon="file-add" onClick={handleTableButtonAdd} > 新增 </Button>
                        <Button key={'doc.measureUnit.management.unit.edit'} disabled={!(isOnlyRadio)} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                        <Button key={'doc.measureUnit.management.unit.delete'} disabled={!(isMultipleChoice)} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                  <BaseTable
                    options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                    onSelect={handleTableSelect}
                    onPrepare={handleTablePrepare}
                    isExpanded={false}
                    setting={unitTableSetting}
                    data={unitData}
                  />
                  <div style={{ marginBottom: 10, marginTop: 10 }}>
                    <SecurityButtonBox>
                      <Button.Group>
                        <Button key={'doc.measureUnit.management.transform.add'} disabled={!currentUnit.id} icon="file-add" onClick={handleTransformButtonAdd} > 新增全部 </Button>
                        <Button key={'doc.measureUnit.management.transform.edit'} disabled={preparedTransforms.length !== 1} icon="edit" onClick={handleTransformButtonEdit} > 编辑 </Button>
                        <Button key={'doc.measureUnit.management.transform.delete'} disabled={!preparedTransforms.length} icon="delete" onClick={handleTransformButtonDelete} > 删除 </Button>
                      </Button.Group>
                    </SecurityButtonBox>
                  </div>
                    <BaseTable
                      options={ {pagination:{pageSize:5, showQuickJumper:true,}} }
                      onPrepare={transformTablePrepare}
                      isExpanded={false}
                      setting={transformTableSetting}
                      data={currentUnit ? currentUnit.conversUnit : []}
                    />
                </div>
              </div>
            </Col>
          </Row>
          <UnitEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleEditFormSubmitSuccess}
            onFormCancel = {handleEditFormCancel}
            editUnit = {prepareItems[0]} />

          <TransformUnitAddDialog
            visible = {editType === 'transadd'}
            onTransformAdd = {handleAddTransformSubmitSuccess}
            onTransformAddCancel = {handleEditFormCancel} />

          <TransformUnitEditDialog
            editType = {this.props.editType}
            visible = {editType === '度量单位转换关系编辑'}
            onFormSubmit = {handleEditTransformSubmitSuccess}
            onFormCancel = {handleEditFormCancel}
            editTransformUnit = {prepareTransforms[0]} />
        </Spin>
      </div>
    );
  }
}
