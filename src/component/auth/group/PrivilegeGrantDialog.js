import React, {Component} from 'react';
import { Modal } from 'antd';
import BaseTable from '../../public/BaseTable';

class PrivilegeGrantDialog extends Component {

  constructor(props){
    super(props);
    this.state = {
      preparedPrivilegeKeys: []
    };
  }

  componentWillReceiveProps(props){
    if(this.props.visible !== props.visible){
      this.setState({preparedPrivilegeKeys: []});
    }
  }

  render(){
    const { setting } = this.props;


    const handleConfirm = (e) => {
      this.props.onConfirm(this.state.preparedPrivilegeKeys);
    }

    const handleCancel = (e)  => {
      this.props.onCancel();
    }

    const handlePrivilegePrepare = (privileges) => {
      let preparedPrivilegeKeys = privileges.map( item => item.key );
      this.setState({preparedPrivilegeKeys});
    }

    return(
      <Modal
        style = {{top:20}}
        width={'600px'}
        title = '请勾选授权对象'
        visible = {this.props.visible}
        onOk = {handleConfirm}
        onCancel = {handleCancel} >

        <BaseTable
          onPrepare={handlePrivilegePrepare}
          isExpanded={false}
          setting={setting}
          data={this.props.data}
        />

      </Modal>
    );
  }
}

export default PrivilegeGrantDialog;
