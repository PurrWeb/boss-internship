import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    venues: state.get('venues'),
    currentVenue: state.get('currentVenue'),
    isEditMode: state.get('isEditMode'),
    notification: state.get('notification'),
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
    const {
      changeVenue,
      toggleEditMode,
      onNotificationClose,
    } = this.props.actions;

    const {
      venues,
      currentVenue,
      isEditMode,
      notification,
    } = this.props;
    
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
