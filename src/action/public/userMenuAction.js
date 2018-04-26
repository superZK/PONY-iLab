import { message } from 'antd';
import fetchData from '../../util/fetchGateway';

export const MODIFY_PASSWORD = 'MODIFY_PASSWORD';
export const MODIFY_PASSWORD_START = 'MODIFY_PASSWORD_START';
export const MODIFY_PASSWORD_SUCCESS = 'MODIFY_PASSWORD_SUCCESS';
export const MODIFY_SIGNTURE_PASSWORD = 'MODIFY_SIGNTURE_PASSWORD';
export const MODIFY_SIGNTURE_PASSWORD_START = 'MODIFY_SIGNTURE_PASSWORD_START';
export const MODIFY_SIGNTURE_PASSWORD_SUCCESS = 'MODIFY_SIGNTURE_PASSWORD_SUCCESS';
export const MODIFY_PASSWORD_CANCEL = 'MODIFY_PASSWORD_CANCEL';

// 修改密码
export const handleClickModifyPassword = () => ({
  type : MODIFY_PASSWORD
});

export const handleClickModifySignturePassword = () => ({
  type : MODIFY_SIGNTURE_PASSWORD
});

export const cancelModify = () => ({
  type : MODIFY_PASSWORD_CANCEL
});

export const modifyPassWordStart = () => ({
  type : MODIFY_PASSWORD_START
});

export const modifyPassWordSuccess = () => ({
  type : MODIFY_PASSWORD_SUCCESS
});

export const modifyPassWord = (password) => (dispatch, state) => {
  dispatch(modifyPassWordStart());
  fetchData('/auth/user/update/password', {
    body: JSON.stringify(password)
  }).then(
    (receipt) => {
      dispatch(modifyPassWordSuccess(receipt.data));
      if(receipt.code == 0){
        message.success('密码修改成功!');
      }
    },
    (error) => {
      console.log(error);
     }
  );
};

export const modifySignturePassWordStart = () => ({
  type : MODIFY_SIGNTURE_PASSWORD_START
});

export const modifySignturePassWordSuccess = () => ({
  type : MODIFY_SIGNTURE_PASSWORD_SUCCESS
});

export const modifySignturePassWord = (password) => (dispatch, state) => {
  dispatch(modifySignturePassWordStart());
  fetchData('/auth/user/update/signturePassword', {
    body: JSON.stringify(password)
  }).then(
    (receipt) => {
      dispatch(modifySignturePassWordSuccess(receipt.data));
      if(receipt.code == 0){
        message.success('签名密码修改成功!');
      }
    },
    (error) => {
      console.log(error);
     }
  );
};
