import React, {Component} from 'react';
import { Spin, Button } from 'antd';
import OrganizationAddEditDialog from './OrganizationAddEditDialog';
import ConfirmModal from '../../public/ConfirmModal';
import Setting from '../../../config/index';
import BaseTable from '../../public/BaseTable';
import SecurityButtonBox from '../../public/SecurityButtonBox';
import { getPreparedItems } from '../../../util/getPreparedItems';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class OrganizationManagement extends Component{

  componentDidMount(){
    const {asyncLoadOrgData} = this.props;
    asyncLoadOrgData();
  }

  render(){
    const {
    isLoading,
    editType,//操作类型
    organizationData,//组织结构数据
    preparedOrgs,//勾选的组织数据
    modalTitle,//公用modal标题
    modalInformation,//公用modal内容
    } = this.props;
    const{
    asyncLoadOrgData,//查询数据
    addOrganizationData,//弹出新增modal
    asyncSaveOrg,//新增+编辑组织结构数据
    preparedOrg,//获取表格勾选项
    preparedKeys,//获取表格勾选项Keys
    editOrganizationData,//弹出编辑modal
    deleteOrganizationData,//弹出删除modal
    asyncDeleteOrgs,//删除组织数据
    cancelHandle,//取消操作，关闭modal
    } = this.props;

    const orgTableSetting = Setting.OrganizationSetting.table.Organization;//表格配置项

    // 新增+编辑组织结构数据
    const handleButtonAddOrgData = () => {
      addOrganizationData();
    }

    const handleTableButtonEdit = () => {
      editOrganizationData();
    }

    const handleAddEditFormSubmitSuccess = (values) => {
      let c = {
        areaId: values.areaId,
        name: values.name,
        code: values.code,
        address1: values.address1,
        address2: values.address2,
        address3: values.address3,
        postcode: values.postcode,
        tel: values.tel,
        fax: values.fax,
      };
      let areaId = c.areaId;
      if(editType === '编辑')
        c.id = preparedOrgs[0].id;
      asyncSaveOrg(c, editType, areaId);
    }

    // 获取表格勾选项
    const handleTablePrepare = (rows, rowKeys) => {
      preparedOrg(rows, rowKeys);
    };

    // 删除组织数据
    const handleTableButtonDelete = () => {
      deleteOrganizationData();
    }

    const handleDeleteSuccess = () => {
      asyncDeleteOrgs(preparedOrgs.map((item) => (item.id)));
    }

    // 通用取消方法
    const handleFormCancel = () => {
      cancelHandle();
    }

    const prepareItems = getPreparedItems(organizationData, preparedKeys);

    return (
      <div>
        <Spin spinning={isLoading} delay={300} >
          <div style={{ marginBottom: 16 }}>
            <SecurityButtonBox>
              <Button.Group>
                <Button key={'org.site.management.add'} icon="file-add" onClick={handleButtonAddOrgData} > 新增 </Button>
                <Button key={'org.site.management.edit'} disabled={preparedOrgs.length !== 1} icon="edit" onClick={handleTableButtonEdit} > 编辑 </Button>
                <Button key={'org.site.management.delete'} disabled={!preparedOrgs.length} icon="delete" onClick={handleTableButtonDelete} > 删除 </Button>
              </Button.Group>
            </SecurityButtonBox>
          </div>
          <BaseTable
            options={ {pagination:{pageSize:10, showQuickJumper:true,}} }
            onPrepare={handleTablePrepare}
            isExpanded={false}
            setting={orgTableSetting}
            data={organizationData}
          />

          <OrganizationAddEditDialog
            editType = {this.props.editType}
            visible = {editType === '新增' || editType === '编辑'}
            onFormSubmit = {handleAddEditFormSubmitSuccess}
            onFormCancel = {handleFormCancel}
            editItem = {prepareItems[0]}
            />

          <ConfirmModal
            visible = {editType === 'delete'}
            title ={modalTitle}
            information = {modalInformation}
            onConfirm = {handleDeleteSuccess}
            onCancel = {handleFormCancel} />
        </Spin>
      </div>
    );
  }
}
