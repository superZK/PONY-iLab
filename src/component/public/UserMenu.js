import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NoticeIcon from './NoticeIcon/index';
import moment from 'moment';
import { Menu, Icon, Dropdown, Avatar, Row, Col } from 'antd';
import ModifyPassword from './UserMenuModifyPassword';
import ModifySignaturePassword from './UserMenuModifySignaturePassword';

export default class UserMenu extends Component {
  state = { domWidth: '' };//greeting宽度

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.user !== this.props.user){
      this.setState({
        domWidth: document.getElementById('greeting').offsetWidth,
      });
    }
  }

  render() {
    const data = [{
      key: '1',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      title: '曲丽丽 评论了你',
      description: '描述信息描述信息描述信息',
      datetime: moment('2017-08-07').fromNow(),
    }, {
      key: '2',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      title: '朱偏右 回复了你',
      description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
      datetime: moment('2017-08-07').fromNow(),
    }, {
      key: '3',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      title: '标题',
      description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
      datetime: moment('2017-08-07').fromNow(),
    }];
    const { domWidth } = this.state;

    const {
      user,
      editType,
    } = this.props;

    const {
      handleClickModifyPassword,
      modifyPassWord,
      handleClickModifySignturePassword,
      modifySignturePassWord,
      cancelModify,
    } = this.props;

    const handleClick = (value) => {
      if(value.key === 'item_1'){
        handleClickModifyPassword();
      }else if(value.key === 'item_2'){
        handleClickModifySignturePassword();
      }
    }

    const ModifyPassWordSuccess = (values) => {
      let c = {
        originalPassword: values.originalPassword,
        password: values.password,
      }
      modifyPassWord(c);
    }

    const ModifySignaturePassWordSuccess = (values) => {
      let c = {
        originalPassword: values.originalPassword,
        signaturePassword: values.signaturePassword,
      }
      modifySignturePassWord(c);
    }

    const ModifyPassWordFail = (err) => {
      console.log(err);
    }

    const ModifyPassWordCancel =() => {
      cancelModify();
    }

    const menu = (
      <Menu selectedKeys={[]} style={{marginRight:10,width:120}} onClick={handleClick}>
        <Menu.Item ><Icon type="user" style={{marginRight:5}} />个人中心</Menu.Item>
        <Menu.Item ><Icon type="setting" style={{marginRight:5}} />修改密码</Menu.Item>
        <Menu.Item ><Icon type="key" style={{marginRight:5}} />修改签名密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" style={{float:'left',marginRight:5,marginTop:4}}/><a href='/logout' style={{textDecoration:'none'}}>退出登录</a></Menu.Item>
      </Menu>
    );

    return (
      <div>
        {/* <div style={{ width: 30, textAlign: 'right', backgroundColor:'red', position:'absolute' }}>
          <NoticeIcon count={10}>
            <NoticeIcon.Tab list={data} title="通知" />
            <NoticeIcon.Tab list={data} title="消息" />
            <NoticeIcon.Tab list={[]} title="待办" />
          </NoticeIcon>
        </div> */}
        <div>
          <Dropdown
            overlay={menu}
            getPopupContainer={() => document.getElementById(this.props.elementId)}
            placement={'bottomCenter'}
          >
            <span style={{verticalAlign:'center'}} >
              <Avatar style={{ backgroundColor: '#87d068', right:domWidth, marginRight:5 }} icon="user" id={'avater'}/>
              <div style={{position: 'absolute', right: 12, top: 24, cursor:'pointer' }} >
                <span id='greeting' style={{fontSize:12}}>{`您好,${user}`}</span>
                <Icon type="down" style={{marginLeft:4}} />
              </div>
            </span>
          </Dropdown>

          <ModifyPassword
            visible = {editType === 'modifyPassWord'}
            onFormSubmitSuccess = {ModifyPassWordSuccess}
            onFormSubmitFail = {ModifyPassWordFail}
            onFormCancel = {ModifyPassWordCancel}
          />
          <ModifySignaturePassword
            visible = {editType === 'modifySignturePassWord'}
            onFormSubmitSuccess = {ModifySignaturePassWordSuccess}
            onFormSubmitFail = {ModifyPassWordFail}
            onFormCancel = {ModifyPassWordCancel}
          />
        </div>
      </div>
    );
  }
}
