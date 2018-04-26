import React from 'react';
import { message, Modal } from 'antd';
import fetch from 'isomorphic-fetch';

const DEFAULT_FETCH_OPTIONS = {
    credentials: 'include',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

const callback = (receipt) => {
  if('0' !== receipt.code){
    Modal.info({
      title: '调用异常:' + receipt.code,
      content: (
        <div>
          <p>{receipt.message}</p>
        </div>
      ),
      onOk() {},
    });
  }else{
    if(receipt.message){
      message.success(receipt.message);
    }
  }
}

const fetchData = (url, options = {}, interceptor) => {
  return fetch(url, Object.assign(options,DEFAULT_FETCH_OPTIONS))
    .then(
      response => {
        let res = response.json();
        return res.then(
          receipt => {
            // 如果定义了拦截器，则调用拦截器对数据做预处理
            if(receipt.code === '0'){
              if(interceptor){
                if(typeof(interceptor) === 'function'){
                  interceptor(receipt);
                }else if(Array.isArray(interceptor)){
                  interceptor.forEach( x => x(receipt));
                }
              }
            }
            // 数据后处理，例如：处理用户提示信息
            callback(receipt);
            // 调用前台自定义后续处理过程
            return new Promise(function(resolve, reject) {
              if(receipt.code === '0')
                resolve(receipt);
              else {
                reject(receipt);
              }
            });
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
}

export const spliceURL = (url, params) => {
  return url + '?' + Object.keys(params).filter((key) => typeof(params[key]) !== 'undefined').map( key => key + '=' + params[key]).join('&');
}

const getFieldByPath = (obj, path) => {
  let key = path[0];
  if(key in obj){
    let value = obj[key];
    if(value){
      if(path.length > 1){
        return getFieldByPath(value, path.slice(1));
      }else{
        return value;
      }
    }
  }
  return null;
}

const setFieldValue = (data, sourcePath, targetPath ) => {
  if(typeof(sourcePath) !== 'string') return;
  if(Array.isArray(data)) return;

  let isExist = (sourcePath in data);
  let isEmbedded = (typeof(targetPath) !== 'string');

  if(isExist){
    if(Array.isArray(data[sourcePath])){  // 只有属性存在，并且是数组时，才会递归执行，否则跳过（已有值不能覆盖）
      if(isEmbedded){ // 对于数组对象，其目标值路径必须是嵌套路径
        for(let key in targetPath){
          data[sourcePath].map((x) => {
            setFieldValue(x, key, targetPath[key]);
          });
        }
      }
    }
  }else{
    // 如果指定属性不存在于目标对象，则创建、赋值
    if(isEmbedded) return;  // 对于不存在的属性，同样不存在嵌套路径的可能
    data[sourcePath] = '' + getFieldByPath(data, targetPath.split('.'));
  }
}

/*
根据规则生成结果处理函数
规则定义范例：
******************************
{
  'key':'id',
  'ptid':'productType.id',
  'productTest':{
    'tpid':'testPlan.id'
  }
}
******************************
key: 目标属性（只能是单级属性名，不允许多级路径）
value: 源属性（允许存在以‘.’分隔的多级路径）
1. 如果key对应的值已存在，且不是数组，则忽略此操作
2. 如果key对应的值已存在，是数组，则value必须是一个嵌套对象，含义为在该数组下所有的元素上递归执行结果处理
3. 如果key对应的值不存在，则value不能是嵌套对象，在目标数据对象上创建key属性，并赋值为value对应的值
4. 所有创建的新属性，其值都将转换为字符串类型
*/
export const fieldMapper = (map = {}) => {
  return ((data) => {
    setFieldValue(data, 'data', map);
  });
}

export const idToKeyInterceptor = ( data = {} ) => {
  if(data){
    if(Array.isArray(data)){
      data.forEach( x => idToKeyInterceptor(x));
    }else if('object' === typeof(data)){
      if(data['id'] && !data['key']){
        data['key'] = '' + data['id'];
      };

      for(let prop in data){
        if('object' === typeof(data[prop]) || Array.isArray(data[prop])){
          idToKeyInterceptor(data[prop]);
        }
      }
    }
  }  
}

export default fetchData;
