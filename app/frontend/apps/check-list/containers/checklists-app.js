import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';

import Dashboard from '../components/dashboard';
import ChecklistDashboard from '../components/check-list-dashboard';

import { changeVenue } from '../actions/venue-actions.js';
import { toggleEditMode } from '../actions/toggle-edit-mode.js';
import CheckListsEditMode from '../components/edit-mode';
import CheckLists from '../components/checklists';
import EditIndicator from '../components/edit-mode/check-list-edit-indicator';
import ChecklistNotification from '../components/checklist-notification';

import {
  onNotificationClose,
} from '../actions/check-lists-actions';

const mapStateToProps = (state) => {
  return {
    venues: state.getIn(['checklists', 'venues']),
    currentVenue: state.getIn(['checklists', 'currentVenue']),
    isEditMode: state.getIn(['checklists', 'isEditMode']),
    notification: state.getIn(['checklists', 'notification']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      changeVenue,
      toggleEditMode,
      onNotificationClose,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class CheckListsApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const actions = oFetch(this.props, 'actions');
    const changeVenue = oFetch(actions, 'changeVenue');
    const toggleEditMode = oFetch(actions, 'toggleEditMode');
    const onNotificationClose = oFetch(actions, 'onNotificationClose');
    const venues = oFetch(this.props, 'venues');
    const currentVenue = oFetch(this.props, 'currentVenue');
    const isEditMode = oFetch(this.props, 'isEditMode');
    const notification = oFetch(this.props, 'notification');
    const hasAccessToChecklistSubmissionsPage = oFetch(this.props, 'hasAccessToChecklistSubmissionsPage')

    return (
      <div>
        {isEditMode && <EditIndicator />}
        {notification && <ChecklistNotification notification={notification} onClose={onNotificationClose} /> }
        <Dashboard title="Checklist">
          <ChecklistDashboard
            venues={venues}
            currentVenue={currentVenue}
            onChangeVenue={changeVenue}
            onToggleEditMode={toggleEditMode}
            hasAccessToChecklistSubmissionsPage={hasAccessToChecklistSubmissionsPage}
            isEditMode={isEditMode}
          />
        </Dashboard>
        {
          isEditMode
            ? <CheckListsEditMode />
            : <CheckLists />
        }
      </div>
    )
  }
}

export default CheckListsApp;
