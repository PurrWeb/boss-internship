import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import VenueSelect from '~/components/security-rota/venue-select';

class RequestsVenueFilter extends PureComponent {
  render() {
    const selectedVenues = oFetch(this.props, 'selectedVenues');
    const venueTypes = oFetch(this.props, 'venueTypes');
    const onChangeSelectedVenues = oFetch(this.props, 'onChangeSelectedVenues');
    return (
      <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
        <p className="boss-form__label boss-form__label_type_icon-filter">
          <span className="boss-form__label-text">Venue</span>
        </p>
        <VenueSelect
          selectedTypes={selectedVenues}
          venueTypes={venueTypes}
          onChange={venueIds => onChangeSelectedVenues({venueIds})}
        />
      </div>
    );
  }
}

RequestsVenueFilter.propTypes = {
  selectedVenues: PropTypes.array.isRequired,
  venueTypes: PropTypes.array.isRequired,
  onChangeSelectedVenues: PropTypes.func.isRequired,
};

export default RequestsVenueFilter;
