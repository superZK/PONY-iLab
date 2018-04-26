import React, {Component} from 'react';
import {Provider} from 'react-redux';
import DevTools from './container/public/DevTools';
import fetchData from './util/fetchGateway';
import {isDevelopMode} from './util/sysinfo';
import App from './App';

export default class Root extends Component {

  render(){
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <App />
          {(isDevelopMode()) ? <DevTools /> :  ''}
        </div>
      </Provider>
    );
  }
}
