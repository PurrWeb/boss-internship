import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('checklists');

const makeSelectChecklists = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('checklists')
);

const makeSelectEditingChecklist = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('editingChecklist')
);

const makeSelectNewChecklistItems = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['newCheckList', 'items'])
);

const makeSelectNewChecklistName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['newCheckList', 'name'])
);

const makeSelectNewChecklistIsOpen = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['newCheckList', 'isOpen'])
);


export {
  makeSelectNewChecklistItems,
  makeSelectNewChecklistName,
  makeSelectChecklists,
  makeSelectEditingChecklist,
  makeSelectNewChecklistIsOpen,
}
