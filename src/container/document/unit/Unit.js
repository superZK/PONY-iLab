import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MeasureUnitTable from '../../../component/document/unit/Unit';
import {
  asyncLoadData,
  asyncSelectUnit,
  addUnit,
  asyncSaveUnit,
  prepareUnit,
  editUnit,
  asyncDeleteUnits,
  getCurrentUnit,
  addTransformUnit,
  asyncSaveTransformUnit,
  preparedTransform,
  editTransformUnit,
  asyncEditTransformUnit,
  asyncDeleteTransforms,
  cancelAddUnit,
  cancelEditUnit,
  cancelDeleteUnits,
  cancelEditTransformUnit,
} from '../../../action/document/unit/unitAction';

const mapStateToProps = (state) => ({
  isLoading : state.MeasureUnitTable.get('isLoading'),
  editType : state.MeasureUnitTable.get('editType'),
  categoryData : state.MeasureUnitTable.get('categoryData'),
  preparedUnits : state.MeasureUnitTable.get('preparedUnits'),
  preparedKeys : state.MeasureUnitTable.get('preparedKeys'),
  preparedTransformKeys : state.MeasureUnitTable.get('preparedTransformKeys'),
  preparedTransforms : state.MeasureUnitTable.get('preparedTransforms'),
  unitData : state.MeasureUnitTable.get('unitData'),
  selecctedUnitKey : state.MeasureUnitTable.get('selecctedUnitKey'),
  currentUnit : state.MeasureUnitTable.get('currentUnit'),
  needReload : state.MeasureUnitTable.get('needReload'),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    asyncLoadData,
    asyncSelectUnit,
    addUnit,
    asyncSaveUnit,
    prepareUnit,
    editUnit,
    asyncDeleteUnits,
    getCurrentUnit,
    addTransformUnit,
    asyncSaveTransformUnit,
    preparedTransform,
    editTransformUnit,
    asyncEditTransformUnit,
    asyncDeleteTransforms,
    cancelAddUnit,
    cancelEditUnit,
    cancelDeleteUnits,
    cancelEditTransformUnit,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasureUnitTable);
