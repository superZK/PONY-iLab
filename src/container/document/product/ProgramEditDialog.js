import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ProgramEditDialog from '../../../component/document/product/ProgramEditDialog';
import {
  loadTestFlowData,
  addTestFlow,
  asyncAddTestFlow,
  asyncAddTestFlowByTable,
  preparedTestFlow,
  asyncDeleteItems,
  editTestFlow,
  asyncEditTestFlow,
  addRecordItem,
  asyncAddRecordItem,
  getCurrentItem,
  preparedRecord,
  asyncDeleteRecords,
  editRecordItem,
  asyncEditRecordItem,
  addTestFlowCancel,
  cancelDeleteItems,
  resetCurrentItem,
} from '../../../action/document/product/programEditDialogAction';

const mapStateToProps = (state) => ({
  testFlowData : state.ProgramEditDialog.get('testFlowData'),
  handleType : state.ProgramEditDialog.get('handleType'),
  preparedTestFlows : state.ProgramEditDialog.get('preparedTestFlows'),
  preparedTestFlowKeys : state.ProgramEditDialog.get('preparedTestFlowKeys'),
  preparedRecordKeys : state.ProgramEditDialog.get('preparedRecordKeys'),
  currentItem : state.ProgramEditDialog.get('currentItem'),
  preparedRecords : state.ProgramEditDialog.get('preparedRecords'),
  resultAddDataSource : state.ProgramEditDialog.get('resultAddDataSource'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    loadTestFlowData,
    addTestFlow,
    asyncAddTestFlow,
    asyncAddTestFlowByTable,
    preparedTestFlow,
    asyncDeleteItems,
    editTestFlow,
    asyncEditTestFlow,
    addRecordItem,
    asyncAddRecordItem,
    getCurrentItem,
    preparedRecord,
    asyncDeleteRecords,
    editRecordItem,
    asyncEditRecordItem,
    addTestFlowCancel,
    cancelDeleteItems,
    resetCurrentItem,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramEditDialog);
