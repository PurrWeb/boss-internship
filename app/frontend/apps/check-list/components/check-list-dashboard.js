import React from 'react';
import VenuesSelect from '~/components/select-venue';
import { appRoutes } from "~/lib/routes"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';

export default class ChecklistDashboard extends React.Component {

  onButtonClick = () => {
    this.props.actions.toggleEditMode();
  };

  actionButtons = (isEditMode, onToggleEditMode, hasAccessToChecklistSubmissionsPage, currentVenue) => {
    if(isEditMode){
      return <div className="boss-page-dashboard__buttons-group">
        <button onClick={onToggleEditMode} className="boss-button boss-button_role_cancel boss-page-dashboard__button">Cancel</button>
      </div>;
    } else {
      return <div className="boss-page-dashboard__buttons-group">
        { hasAccessToChecklistSubmissionsPage && <a href={appRoutes.checklistSubmissionsPage({venueId: currentVenue.id})} className="boss-button boss-button_role_view-submissions boss-page-dashboard__button">View Submissions</a>}
        <button onClick={onToggleEditMode} className="boss-button boss-button_role_edit-mode boss-page-dashboard__button">Edit Mode</button>
      </div>;
    }
  }

  render() {
    const venues = oFetch(this.props, 'venues');
    const isEditMode = oFetch(this.props, 'isEditMode');
    const onChangeVenue = oFetch(this.props, 'onChangeVenue');
    const onToggleEditMode = oFetch(this.props, 'onToggleEditMode');
    const currentVenue = oFetch(this.props, 'currentVenue').toJS();
    const hasAccessToChecklistSubmissionsPage = oFetch(this.props, 'hasAccessToChecklistSubmissionsPage');

    return <div className="boss-page-dashboard__group">
      <div className="boss-page-dashboard__controls-group">
      </div>
      { this.actionButtons(isEditMode, onToggleEditMode, hasAccessToChecklistSubmissionsPage, currentVenue) }
    </div>
  }
};
