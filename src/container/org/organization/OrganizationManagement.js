import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import OrganizationManagement from '../../../component/org/organization/OrganizationManagement';
import {
asyncLoadOrgData,//查询接口
addOrganizationData,//打开新增modal
asyncSaveOrg,//新增组织结构
preparedOrg,//获取表格勾选项
editOrganizationData,//弹出编辑modal
deleteOrganizationData,//弹出删除modal
asyncDeleteOrgs,//弹出删除modal
cancelHandle,//取消操作，关闭modal
} from '../../../action/org/organization/organizationManagementAction';

const mapStateToProps = (state) => ({
  isLoading : state.OrganizationManagement.get('isLoading'),
  editType : state.OrganizationManagement.get('editType'),
  organizationData : state.OrganizationManagement.get('organizationData'),
  preparedOrgs : state.OrganizationManagement.get('preparedOrgs'),
  preparedKeys : state.OrganizationManagement.get('preparedKeys'),
  modalTitle : state.OrganizationManagement.get('modalTitle'),
  modalInformation : state.OrganizationManagement.get('modalInformation'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
  asyncLoadOrgData,
  addOrganizationData,
  asyncSaveOrg,
  preparedOrg,
  editOrganizationData,
  deleteOrganizationData,
  asyncDeleteOrgs,
  cancelHandle,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationManagement);
