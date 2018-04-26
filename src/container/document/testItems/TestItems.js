import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TestItems from '../../../component/document/testItems/TestItems';
import {
  asyncLoadData,
  asyncSelectItem,
  addItem,
  editItem,
  asyncSaveItem,
  prepareItem,
  asyncDeleteItems,
  upItem,
  asyncUpVersion,
  activeItem,
  enableItem,
  asyncActiveEnable,
  viewOldVersionItem,
  getCurrentItem,
  preparedRecord,
  addRecordItem,
  editRecordItem,
  asyncEditRecordItem,
  asyncDeleteRecords,
  cancelAddEdit,
  cancelDeleteItems,
  importItem,
  exportItem,
} from '../../../action/document/testItems/testItemsAction';

const mapStateToProps = (state) => ({
  isLoading : state.TestItems.get('isLoading'),
  editType : state.TestItems.get('editType'),
  categoryData : state.TestItems.get('categoryData'),
  selectedItemKey : state.TestItems.get('selectedItemKey'),
  itemData : state.TestItems.get('itemData'),
  preparedItems : state.TestItems.get('preparedItems'),
  preparedKeys : state.TestItems.get('preparedKeys'),
  preparedRecordKeys : state.TestItems.get('preparedRecordKeys'),
  currentItem : state.TestItems.get('currentItem'),
  preparedRecords : state.TestItems.get('preparedRecords'),
  modalTitle : state.TestItems.get('modalTitle'),
  modalInformation : state.TestItems.get('modalInformation'),
  oldVersions : state.TestItems.get('oldVersions'),
  needReload : state.TestItems.get('needReload'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadData,
    asyncSelectItem,
    addItem,
    editItem,
    asyncSaveItem,
    prepareItem,
    asyncDeleteItems,
    upItem,
    asyncUpVersion,
    activeItem,
    enableItem,
    asyncActiveEnable,
    viewOldVersionItem,
    getCurrentItem,
    preparedRecord,
    addRecordItem,
    editRecordItem,
    asyncEditRecordItem,
    asyncDeleteRecords,
    cancelAddEdit,
    cancelDeleteItems,
    importItem,
    exportItem,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestItems);
