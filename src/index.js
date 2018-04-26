import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import reducer from './modules';
import DevTools from './container/public/DevTools';
import Root from './Root';
import './index.css';
import './index.less';
import registerServiceWorker from './registerServiceWorker';

const enhancer = compose(
  applyMiddleware(thunk),
  DevTools.instrument()
);
const store = createStore(reducer, {}, enhancer);

ReactDOM.render(
  <Root store={store}/>, document.getElementById('root')
);

registerServiceWorker();
