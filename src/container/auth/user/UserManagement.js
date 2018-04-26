import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserManagement from '../../../component/auth/user/UserManagement';
import {
  asyncLoadGroupData,//加载用户组数据
  handleGroupSelect,//用户组树节点选取
  asyncLoadUser,//查询用户信息
  addUser,//打开新增modal
  asyncSaveUser,//新增+编辑用户数据
  LinkGroup,//打开关联用户组modal
  asyncLinkUserToGroup,//关联用户组
  DisconnectGroup,//解除关联用户组
  preparedUser,//获取表格勾选项
  editUser,//打开编辑modal
  forbidUser,//打开锁定modal
  allowUser,//打开解除锁定modal
  asyncAllowForbid,//激活或锁定用户
  disableUser,//打开禁用modal
  activeUser,//打开激活modal
  asyncDisable,//禁用用户
  asyncModifyPws,//重置密码
  cancelHandle,//取消操作
} from '../../../action/auth/user/userManagementAction';

const mapStateToProps = (state) => ({
  isLoading: state.UserManagement.get('isLoading'),
  editType: state.UserManagement.get('editType'),
  modalTitle: state.UserManagement.get('modalTitle'),
  modalInformation: state.UserManagement.get('modalInformation'),
  userData: state.UserManagement.get('userData'),
  groupData: state.UserManagement.get('groupData'),
  selectedGruop: state.UserManagement.get('selectedGruop'),
  preparedUsers: state.UserManagement.get('preparedUsers'),
  preparedKeys: state.UserManagement.get('preparedKeys'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadGroupData,
    handleGroupSelect,
    asyncLoadUser,
    addUser,
    asyncSaveUser,
    LinkGroup,
    DisconnectGroup,
    asyncLinkUserToGroup,
    preparedUser,
    editUser,
    forbidUser,
    allowUser,
    asyncAllowForbid,
    disableUser,
    activeUser,
    asyncDisable,
    asyncModifyPws,
    cancelHandle,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
