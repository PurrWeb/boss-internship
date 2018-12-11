import React, { Component } from 'react';
import oFetch from 'o-fetch';
import VenueSelect from '~/components/security-rota/venue-select';

export default class VenueSelectFilter extends Component {
  render() {
    const [venueTypes, selectedVenueIds, onChangeVenuesFilter] = oFetch(
      this.props,
      'venueTypes',
      'selectedVenueIds',
      'onChangeVenuesFilter',
    );
    return (
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__meta" />
        <div className="boss-page-dashboard__controls-group">
          <div className="boss-form">
            <div className="boss-form__field boss-form__field_role_control">
              <p className="boss-form__label boss-form__label_type_icon-venue boss-form__label_type_icon-single" />
              <VenueSelect
                className="boss-form__select_role_dashboard-multi"
                selectedTypes={selectedVenueIds}
                venueTypes={venueTypes}
                onChange={onChangeVenuesFilter}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
