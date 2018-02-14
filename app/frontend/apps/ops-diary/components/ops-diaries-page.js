import React, { Component } from 'react';

import {
  SimpleDashboard,
  DashboardFilter,
  DashboardActions,
} from '~/components/boss-dashboards';

import { openWarningModal, openContentModal } from '~/components/modals';
import * as constants from '../constants';
import { getInitialFilterData } from '../components/ops-diaries-filter/utils';

import OpsDiariesFilter from './ops-diaries-filter';
import AddNote from './add-note';
import EditNote from './edit-note';
import NotesList from './notes-list';
import NoteItem from './note-item';

class OpsDiariesPage extends Component {
  _submitDiaryEnable = (hideModal, { diaryId }) => {
    return new Promise((resolve, reject) => {
      this.props.actions.enableDiary({
        diaryId,
        resolve,
        reject,
      });
    }).then(() => {
      hideModal();
    });
  };

  _handleDiaryEnable = diaryId => {
    openWarningModal({
      submit: this._submitDiaryEnable,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Enable',
      },
      props: { diaryId },
    });
  };

  _submitDiaryDisable = (hideModal, { diaryId }) => {
    return new Promise((resolve, reject) => {
      this.props.actions.disableDiary({
        diaryId,
        resolve,
        reject,
      });
    }).then(() => {
      hideModal();
    });
  };

  _handleDiaryDisable = diaryId => {
    openWarningModal({
      submit: this._submitDiaryDisable,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Disable',
      },
      props: { diaryId },
    });
  };

  _handleFilter = data => {
    this.props.actions.getDiaries({
      data: data.toJS(),
      formId: constants.FILTER_FORM_NAME,
    });
  };

  _handleEditDiarySubmit = (hideModal, values) => {
    console.log(values.toJS());
    return new Promise((resolve, reject) => {
      console.log('object');
      this.props.actions.updateDiary({
        data: values.toJS(),
        resolve,
        reject,
      });
    }).then(() => {
      hideModal();
    });
  };

  _handleDiaryEdit = diary => {
    openContentModal({
      submit: this._handleEditDiarySubmit,
      config: { title: 'Edit note' },
      props: { diary },
    })(EditNote);
  };

  _submitAddForm = values => {
    return new Promise((resolve, reject) => {
      this.props.actions.createDiary({
        data: values,
        resolve,
        reject,
      });
    });
  };

  _handleAddNoteSubmit = (hideModal, values) => {
    return this._submitAddForm(values.toJS()).then(() => {
      hideModal();
    });
  };

  _handleAddNote = data => {
    openContentModal({
      submit: this._handleAddNoteSubmit,
      config: { title: 'Add note' },
      props: { venues: this.props.venues.toJS() },
    })(AddNote);
  };

  _handleLoadMore = limit => {
    return new Promise((resolve, reject) => {
      this.props.actions.getDiaries({
        data: { ...getInitialFilterData(), limit },
        resolve,
        reject,
      });
    });
  };

  render() {
    return (
      <div>
        <SimpleDashboard title="Ops Diary">
          <DashboardActions>
            <button
              className="boss-button boss-button_role_add"
              onClick={this._handleAddNote}
            >
              Add Note
            </button>
          </DashboardActions>
          <DashboardFilter
            onFilter={this._handleFilter}
            venues={this.props.venues.toJS()}
            component={OpsDiariesFilter}
          />
        </SimpleDashboard>
        <NotesList
          venues={this.props.venues.toJS()}
          users={this.props.users.toJS()}
          notes={this.props.diaries.toJS()}
          onLoadMoreClick={this._handleLoadMore}
          paginate
          totalCount={this.props.totalCount}
          pageSize={this.props.perPage}
          noteRenderer={note => (
            <NoteItem
              canEdit={this.props.page.currentUserId === note.createdByUserId}
              onEdit={this._handleDiaryEdit}
              onEnable={this._handleDiaryEnable}
              onDisable={this._handleDiaryDisable}
              note={note}
            />
          )}
        />
      </div>
    );
  }
}

export default OpsDiariesPage;
