import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeptManagement from '../../../component/org/dept/DeptManagement';
import {
  asyncLoadDept,//根据不同组织加载下属部门
  selectedDept,//获取可搜索树选中的节点
  addDept,//打开新增modal
  asyncSaveDept,//新增+编辑部门数据
  preparedDept,//获取表格勾选项
  editDept,//打开编辑modal
  deleteDept,//打开删除modal
  asyncDeleteDepts,//删除部门数据
  addSubordinate,//复制部门数据添加到树节点中
  cancelHandle,//取消操作
} from '../../../action/org/dept/deptManagementAction';

const mapStateToProps = (state) => ({
  isLoading: state.DeptManagement.get('isLoading'),
  editType: state.DeptManagement.get('editType'),
  deptTree: state.DeptManagement.get('deptTree'),
  selectedDeptItem: state.DeptManagement.get('selectedDeptItem'),
  preparedDepts: state.DeptManagement.get('preparedDepts'),
  preparedKeys: state.DeptManagement.get('preparedKeys'),
  modalTitle: state.DeptManagement.get('modalTitle'),
  modalInformation: state.DeptManagement.get('modalInformation'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadDept,
    selectedDept,
    addDept,
    asyncSaveDept,
    preparedDept,
    editDept,
    deleteDept,
    asyncDeleteDepts,
    addSubordinate,
    cancelHandle,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeptManagement);
