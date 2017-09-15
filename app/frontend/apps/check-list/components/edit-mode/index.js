import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import AddNewCheckList from './check-list-add-new';
import ChecklistEditWrapper from './checklist-edit-wrapper';
import ChecklistEditSingleWrapper from './checklist-edit-single-wrapper';
import ChecklistEditSingle from './checklist-edit-single';
import {
  AddedNewItem,
  AddNewItem,
} from './check-list-add-new';

import {
  editSingle,
  cancelEditSingle,
  updateEditingItem,
  removeEditingItem,
  addEditingItem,
  submitEdited,
  deleteChecklist,
} from '../../actions/check-lists-actions';

import {
  makeSelectChecklists,
  makeSelectEditingChecklist,
} from '../../selectors'

import confirm from '~/lib/confirm-utils';

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      editSingle,
      cancelEditSingle,
      updateEditingItem,
      removeEditingItem,
      addEditingItem,
      submitEdited,
      deleteChecklist,
    }, dispatch)
  };
}
@connect(createStructuredSelector({
  checklists: makeSelectChecklists(),
  editingChecklist: makeSelectEditingChecklist(),
}), mapDispatchToProps)
class CheckListsEditMode extends React.Component {
  onEdit = (checklist) => {
    this.props.actions.editSingle(checklist);
  }

  onDelete = (checklist) => {
    confirm('Are you sure ?', {
      title: 'WARNING !!!',
      actionButtonText: 'Delete',
    }).then(() => {
      this.props.actions.deleteChecklist(checklist);
    });
  }
  
  renderChecklists() {
    return this.props.checklists.map((checklist, index) => {
      return (
        <ChecklistEditWrapper
          key={index}
          title={checklist.get('name')}
          onEdit={this.onEdit.bind(null, checklist)}
          onDelete={this.onDelete.bind(null, checklist)}
        >
          {
            checklist.get('items').map((item, index) => {
              return (
                <div key={index} className="boss-checklist__item">
                  <div className="boss-checklist__control">
                    <p className="boss-checklist__label">
                      <span className="boss-checklist__label-text">
                        {item.get('description')}
                      </span>
                    </p>
                  </div>
                </div>
              )
            })
          }
        </ChecklistEditWrapper>
      )
    });
  }
  
  cancelSingleEdit = () => {
    this.props.actions.cancelEditSingle();
  }
  
  onSubmit = () => {
    this.props.actions.submitEdited()
  }
  
  render() {
    const {
      editingChecklist,
    } = this.props;

    const {
      updateEditingItem,
      removeEditingItem,
      addEditingItem,
      submitEdited,
    } = this.props.actions;

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          { !editingChecklist
            ? <div>
                <AddNewCheckList key="add new" />
                { this.renderChecklists() } 
              </div>
            : <ChecklistEditSingle
                title={editingChecklist.get('name')}
                checklist={editingChecklist}
                onCancel={this.cancelSingleEdit}
                onSubmit={submitEdited}
                onUpdateItem={updateEditingItem}
                onRemoveItem={removeEditingItem}
                onAddNew={addEditingItem}
              />
          }
        </div>
      </div>
    )
  }
}

export default CheckListsEditMode;
