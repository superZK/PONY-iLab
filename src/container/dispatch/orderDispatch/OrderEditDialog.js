import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import PonyComp from "../../index";
import { Modal, Button} from 'antd';
import OrderDispatchSetting from './OrderDispatchConf';

export default class OrderDispatchDialog extends Component {
  render(){
    const { onConfirm, onCancel, operationType, visible, dataSource } = this.props;
    const handleConfirm = () => {
      onConfirm();
    }
    const handleCancel = (e)  => {
      e.preventDefault();
      onCancel();
    }
    return(
      <Modal
        style={{top:40}}
        width={document.body.clientWidth + 'px'}
        title={operationType}
        visible={visible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        >
          {/* <Router>
            <Route key="biz.order.orderEntry" path="/route/biz.order.orderEntry" component={PonyComp.OrderEntry} />
          </Router> */}
          <PonyComp.OrderEntry
            fromEdit={true}
            titleData={[{name:'1'}]}
            sampleData={[{name:'1'}]}
          />
      </Modal>
    );
  }
}
