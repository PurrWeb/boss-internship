import React from 'react';
import DashboardWrapper from '~/components/dashboard-wrapper';
import VenueSelect from '~/components/select-venue';

export default function MachinesIndexDashboard({
  title,
  showCancelButton,
  cancelAction,
  addNewClick,
  venues,
  selectedVenueId,
}) {

  function renderActionButtons() {
    return showCancelButton
      ? <button
          onClick={cancelAction}
          className="boss-button boss-button_role_cancel boss-page-dashboard__button"
        >Cancel</button>
      : <button
          onClick={addNewClick}
          className="boss-button boss-button_role_add boss-page-dashboard__button"
        >Add Machine</button>
  }

  function getVenueById(selectedVenueId, venues) {
    return venues.find(venue => venue.id === selectedVenueId);
  }

  function handleSelectVenue(venue) {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('venue_id', venue.value);
    queryParams.set('page', 1);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  const selectedVenue = getVenueById(selectedVenueId, venues);

  if (!selectedVenue) {
    throw Error('Unknow venue !!!');
  }

  return (
    <DashboardWrapper>
    <div className="boss-page-dashboard boss-page-dashboard_updated">
      <div className="boss-page-dashboard__group">
        <h1 className="boss-page-dashboard__title">{title}</h1>
      </div>
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  </DashboardWrapper>
  )
}
