import {fromJS} from 'immutable';
import {
  MODIFY_PASSWORD,//打开更改密码modal
  MODIFY_PASSWORD_START,
  MODIFY_PASSWORD_SUCCESS,//更改密码成功
  MODIFY_SIGNTURE_PASSWORD,//打开更改签名密码modal
  MODIFY_SIGNTURE_PASSWORD_START,
  MODIFY_SIGNTURE_PASSWORD_SUCCESS,//更改签名密码成功
  MODIFY_PASSWORD_CANCEL,//关闭更改密码modal
} from '../../action/public/userMenuAction';

export default function UserMenu(state = fromJS({
  editType: '',
}), action){
  switch(action.type){
    case MODIFY_PASSWORD :
    case MODIFY_PASSWORD_START :
      return state.set('editType', 'modifyPassWord');
    case MODIFY_SIGNTURE_PASSWORD :
    case MODIFY_SIGNTURE_PASSWORD_START :
      return state.set('editType', 'modifySignturePassWord');
    case MODIFY_PASSWORD_SUCCESS :
      return state.set('editType', '');
    case MODIFY_SIGNTURE_PASSWORD_SUCCESS :
      return state.set('editType', '');
    case MODIFY_PASSWORD_CANCEL :
      return state.set('editType', '');
    default :
      return state;
  }
}
