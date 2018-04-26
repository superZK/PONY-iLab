// 根据preparedKeys获取最新勾选对象
export const getPreparedItems = (datas, preparedKeys) => {
  let preparedItems = [];
  let data = datas || [];
  preparedItems = data.filter((item) => {
    if(item && preparedKeys.includes(item && item.id && item.id.toString())){
      return item;
    }
  });
  if(!(preparedItems.length > 0)){
	return [];
  }
  return preparedItems;
};

// 判断激活与禁用状态，控制按钮disabled切换
export const isAllActiveOrDisable = (preparedItems, attribute = 'activation') => {
  if(!preparedItems.length > 0)
    return;
  let isSame = true;
  const arr = preparedItems.map((items) => {return items[attribute]});
  for(let i = 0; i < arr.length; i++){
    if(arr.indexOf(arr[i]) != 0){
      isSame = false;
      break;
    }
  }

  if(!isSame){
    return 'notAllSame';//所选对象集合激活与禁用状态不全相同
  }else if(isSame && arr[0]){
    return 'allActive';//全为激活状态
  }else if(isSame && !arr[0]){
    return 'allDisable';//全为禁用状态
  }
}
