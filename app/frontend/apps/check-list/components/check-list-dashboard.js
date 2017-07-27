import React from 'react';
import VenuesSelect from '~/components/select-venue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



export default class ChecklistDashboard extends React.Component {

  onButtonClick = () => {
    this.props.actions.toggleEditMode();
  };

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
      { isEditMode 
          ? (<div className="boss-page-dashboard__buttons-group">
              <button onClick={onToggleEditMode} className="boss-button boss-button_role_cancel boss-page-dashboard__button">Cancel</button>
            </div>)
          : (<div className="boss-page-dashboard__buttons-group">
              <button onClick={onToggleEditMode} className="boss-button boss-button_role_edit-mode boss-page-dashboard__button">Edit Mode</button>
            </div>)
      }
    </div>
  }
};
