import React, { Component } from 'react';
import { Badge } from 'antd';

export const findNodeById = (data, idField, subField, id) => {
  for(let node of data){
    if(node[idField] == id) return node;//值相等即可
    if(node[subField] && node[subField].length > 0){
        let c = findNodeById(node[subField], idField, subField, id);
        if(c) return c;
    }
  }
  return null;
};

// 层级为一
export const findParentNodeById = (data, idField, id) => {
  let parentNode = {};
  data.map( (item) => {
    if(item[idField] === id) {
      parentNode = item;
    }
  });
  return parentNode;
};

// 多层级，创建时间为样品节点
export const findParentById = (data, idField, subField, id) => {
  for(let node of data){
    if(node[idField] == id) return data;
    if(node[subField] && node[subField].length > 0){
        let c = findParentById(node[subField], idField, subField, id);
        if(c) return c;
    }
  }
  return null;
};

export const removeNodeById = (data, idField, removeIds) => {
  if(!data || !removeIds || removeIds.length === 0)
    return;
  for( let i = 0; i < removeIds.length; i++){
    for(let j = 0; j < data.length; j++){
      if(data[j][idField] == removeIds[i]){
        data.splice(j, 1);
      }
    }
  }
}

export const replaceNodeById = (data, idField, replaceEntities) => {
  if(!data || !replaceEntities || replaceEntities.length === 0)
    return;
  for( let i = 0; i < data.length; i++){
    for(let j = 0; j < replaceEntities.length; j++){
      if(data[i][idField] === replaceEntities[j][idField]){
        data[i] = replaceEntities[j];
      }
    }
  }
}

export const replaceChildrenById = (parent, idField, subField, replaceEntities) => {
  if(!parent || !replaceEntities || replaceEntities.length === 0)
    return;
  let children = parent[subField];
  if(!children || children.length === 0)
    return;
  for( let i = 0; i < children.length; i++){
    for(let j = 0; j < replaceEntities.length; j++){
      if(children[i][idField] === replaceEntities[j][idField]){
        children[i] = replaceEntities[j];
      }
    }
  }
}

export const removeChildrenById = (parent, idField, subField, removeIds) => {
  if(!parent || !removeIds || removeIds.length === 0)
    return;
  let children = parent[subField];
  if(!children || children.length === 0)
    return;
  for( let i = 0; i < removeIds.length; i++){
    for(let j = 0; j < children.length; j++){
      if(children[j][idField] === Number(removeIds[i])){
        children.splice(j, 1);
      }
    }
  }
}

export const getPathOfNode = (data, idField, subField, id) => {
  let recursiveGetPath = (data, idField, subField, id, path) => {
    for(let item of data){
      // matched
      if(item[idField] === id){
        let p = Array.from(path);
        p[p.length] = item;
        return p;
      }
      // not match, then recursive subordinate
      if(item[subField]){
        let p = Array.from(path);
        p[p.length] = item;
        let sp = recursiveGetPath(item[subField], idField, subField, id, p);
        if(sp.length > p.length) return sp;  // return value is larger then current, means hits success
      }
    }
    return path;
  };

  return recursiveGetPath(data, idField, subField, id, []);
}

export const loopTree = (tree, subField, callBack, parent) => {
  if(tree && tree.length > 0){
    for(let node of tree){
      callBack(node, parent);
      if(node[subField] && node[subField].length > 0)
        loopTree(node[subField], subField, callBack, node);
    }
  }
}

export const searchTreeForKeys = (tree, idField, subField, value, isMatch) => {
  let parentKeys = [];
  let matchedKeys = [];
  let match = (node, parent) => {
    if(isMatch(node, value)){
      let pk = parent[idField];
      let nk = node[idField];
      if(!matchedKeys.includes(nk)) matchedKeys.push(nk);
      if(!parentKeys.includes(pk)) parentKeys.push(pk);
    }
  }
  loopTree(tree, subField, match, {});
  return {matchedKeys, parentKeys};
}

/**
 * 自动拼接带参数url： url?a=3&b=2&c=1
 */
export const spliceUrlByParams = (url, params, ...paramFields) => {
  let paramArr = [];//参数数组[a=3,b=2,c=1]
  let paramList = '';//参数字符串
  // 将参数名全部拼上‘=’，[a=,b=,c=]
  let paramField = paramFields.map((item) => item + '=')
  // 验证用户传递的参数是不是全部为undefined
  const isAllNotUndefined = (element) => {
    return typeof(element) !== 'undefined';
  }
  // 如果不全为undefined，将该参数与对应的参数名拼接在一起，a=3
  if(params.some(isAllNotUndefined)){
    for(let i = 0;i<params.length;i++){
      if(params[i]){
        paramArr.push(paramField[i] + params[i]);
      }
    }
  }
  // 当参数不全为undefined，拼接成正确的url
  if(paramArr.length > 0){
    // 将第一个参数拼上？ ？a=3
    let paramFieldFirst = '?' + paramArr[0];
    // 将剩余参数拼上& &b=2&c=1
    let sliced = paramArr.slice(1);
    let paramFieldOthers = sliced.map( (item) => '&' + item);
    // 合并为一个数组
    paramFieldOthers.unshift(paramFieldFirst);
    for(let j = 0; j < paramFieldOthers.length; j++){
      paramList += paramFieldOthers[j];//拼接参数字符串
    }
  }
  // console.log(url + paramList);
  return (url + paramList);
}

/**
 * 扁平化menuData，并将path存储在新数组中
 */
export const getPermissionPath = (data) => {
  if(!data) return;
  let menuArr = [];
  for(let i = 0; i < data.length; i++){
    menuArr.push(data[i]);
  }

  var menu;
  let linkArr = [];

  while(menuArr.length){
    menu = menuArr.shift();
    if(menu.link){
      linkArr.push(menu.link);
    }

    if(menu.subordinate){
      menuArr = menuArr.concat(menu.subMenu);
      if(menu.subordinate.length > 0){
        menuArr = menuArr.concat(menu.subordinate);
      }
		}

  }
  return linkArr;
}

// 数组去重:[1,2,3,3,4,4]
export const unique = (arr) => {
  return Array.from(new Set(arr));
}

//对象数组根据id去重
export const uniqueObj = (arr, idName) => {
  let ids = arr.map(item => item[idName]);
  for(let i = 0, l = ids.length-1; i < l; i++) {
    for(let j = l; j > i; j--){
      if(ids[i] === ids[j]){
        ids.splice(j, 1);
        arr.splice(j, 1);
      }
    }
  }
  return arr;
}

// 状态点状态判断
export const switchStatus = (status) => {
  switch(status){
    case null:
      return (<Badge status="processing" text="待录入" />);
    case '录入':
      return (<Badge status="processing" text="已录入" />);
    case '待审':
      return (<Badge status="success" text="待审核" />);
    case '己审核':
      return (<Badge status="success" text="己审核" />);
    case '退回':
      return (<Badge status="Error" text="退回" />);
    case '重测':
      return (<Badge status="Error" text="重测" />);
    default:
      return (<Badge status="Default" text="未录入系统" />);
  }
}

// 解析形式为a.b.c的表格的columns的dataIndex 对应数据的值
export const analysisDataIndex = (record, dataIndex) => {
  if(dataIndex.includes('.')){
    let dataIndexArr = dataIndex.split('.');
    for(let i = 0; i < dataIndexArr.length - 1; i++){
      record = record[dataIndexArr[i]]
      if(!record) return null;
    }
    return record[dataIndexArr[dataIndexArr.length - 1]];
  }else{
    return record[dataIndex];
  }
}

// 为数据添加antd需要的唯一的key值
export const AddKeyForData = (dataArr) => {
  const originLength = dataArr.map(item => item.id).length;
  const repeatLength = unique(dataArr.map(item => item.id)).length;
  if(originLength === repeatLength){
    dataArr.map( item => item.key = item.id + '')
  }else if(originLength > repeatLength){
    for(let i = 0; i < dataArr.length; i++){
      dataArr[i].key = (i + 1) + '';
    }
  }
  return dataArr;
}

// 获取一个数组中有没有指定参数，有返回true,没有返回false
export const isInArray = (arr, value) => {
  for(let i = 0; i < arr.length; i++){
      if(value === arr[i]){
          return true;
      }
    }
  return false;
}

// 深拷贝
export const cloneObj = (obj) => {
  let str, newobj = obj.constructor === Array ? [] : {};
  if(typeof obj !== 'object'){
      return;
  } else if(window.JSON){
      str = JSON.stringify(obj), //系列化对象
      newobj = JSON.parse(str); //还原
  } else {
      for(let i in obj){
          newobj[i] = typeof obj[i] === 'object' ?
          cloneObj(obj[i]) : obj[i];
      }
  }
  return newobj;
};

// 将浮点数四舍五入，取小数点后2位
export const toDecimal = (x) => {
  let f = parseFloat(x);
  if (isNaN(f)) {
      return;
  }
  f = Math.round(x*100)/100;
  return f;
}
// 根据pos,规定几位小数 四舍五入
export const fomatFloat = (src,pos) => {
  return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}
