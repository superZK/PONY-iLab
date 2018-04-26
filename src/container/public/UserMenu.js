import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UserMenu from '../../component/public/UserMenu';
import {
  handleClickModifyPassword,//弹出修改密码modal
  modifyPassWord,//提交密码
  handleClickModifySignturePassword,//弹出修改签名密码modal
  modifySignturePassWord,//提交签名密码
  cancelModify,//关闭修改密码modal
} from '../../action/public/userMenuAction';

const mapStateToProps = (state) => ({
  editType: state.UserMenu.get('editType'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    handleClickModifyPassword,
    modifyPassWord,
    handleClickModifySignturePassword,
    modifySignturePassWord,
    cancelModify,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
