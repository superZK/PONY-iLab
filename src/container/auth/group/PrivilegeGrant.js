import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PrivilegeGrant from '../../../component/auth/group/PrivilegeGrant';
import {
  asyncLoadGroupData, // 加载用户组数据
  asyncSelectGroup, // 选取用户组，加载权限数据
  asyncLoadAuthData, // 加载待授权权限
  asyncRevokeAuthData, // 回收权限
  asyncComfirmAuthDataSave, // 确认授权操作
  cancelAuthDataSave, // 取消授权操作
  preparePrivilege, // 权限勾选
  selectPrivilege, // 权限点选
} from '../../../action/auth/group/privilegeGrantAction';

const mapStateToProps = (state) => ({
  isLoading: state.PrivilegeGrant.get('isLoading'),
  groupData: state.PrivilegeGrant.get('groupData'),
  selectedGroupKey: state.PrivilegeGrant.get('selectedGroupKey'),
  privilegeData: state.PrivilegeGrant.get('privilegeData'),
  selectedPrivilegeKey: state.PrivilegeGrant.get('selectedPrivilegeKey'),
  preparedPrivileges: state.PrivilegeGrant.get('preparedPrivileges'),
  authorizationData: state.PrivilegeGrant.get('authorizationData'),
  isEditing: state.PrivilegeGrant.get('isEditing'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadGroupData, // 加载用户组数据
    asyncSelectGroup, // 选取用户组，加载权限数据
    asyncLoadAuthData, // 加载待授权权限
    asyncRevokeAuthData, // 回收权限
    asyncComfirmAuthDataSave, // 确认授权操作
    cancelAuthDataSave, // 取消授权操作
    preparePrivilege, // 权限勾选
    selectPrivilege, // 权限点选
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivilegeGrant);
