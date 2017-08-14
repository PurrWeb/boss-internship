import React from 'react';
import VenuesSelect from '~/components/select-venue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { appRoutes } from "~/lib/routes"



export default class ChecklistDashboard extends React.Component {

  onButtonClick = () => {
    this.props.actions.toggleEditMode();
  };

  actionButtons = (isEditMode, onToggleEditMode, currentVenue) => {
    if(isEditMode){
      return <div className="boss-page-dashboard__buttons-group">
        <button onClick={onToggleEditMode} className="boss-button boss-button_role_cancel boss-page-dashboard__button">Cancel</button>
      </div>;
    } else {
      return <div className="boss-page-dashboard__buttons-group">
        <a href={appRoutes.checklistSubmissionsPage({venueId: currentVenue.id})} className="boss-button boss-button_role_view-submissions boss-page-dashboard__button">View Submissions</a>
        <button onClick={onToggleEditMode} className="boss-button boss-button_role_edit-mode boss-page-dashboard__button">Edit Mode</button>
      </div>;
    }
  }

  render() {
    const {
      venues,
      currentVenue,
      isEditMode,
      onChangeVenue,
      onToggleEditMode,
    } = this.props

    return <div className="boss-page-dashboard__group">
      <div className="boss-page-dashboard__controls-group">
        <VenuesSelect
          options={venues.toJS()}
          selected={currentVenue.toJS()}
          onSelect={onChangeVenue}
        />
      </div>
      { this.actionButtons(isEditMode, onToggleEditMode, currentVenue.toJS()) }
    </div>
  }
};
