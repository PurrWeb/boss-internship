import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

export default class VenueSelector extends React.Component {
  static displayName = 'VenueSelector';

  dropdownOptions() {
    return this.props.venues.map((venue, index) => {
      return (
        <option value={ venue.id } key={venue.id} selected={ this.props.currentVenue.id == venue.id }>
          { venue.name }
        </option>
      );
    });
  }

  redirectVenue(event) {
    document.getElementsByClassName('boss-form')[0].submit();
  }

  venueName() {
    return (this.props.currentVenue) ? _.capitalize(this.props.currentVenue.name) : '';
  }

  render() {
    return (
      <div className="boss-page-dashboard__group">
        <h1 className="boss-page-dashboard__title">{ this.venueName() } health check</h1>
        <div className="boss-page-dashboard__controls-group">
          <form className="boss-form" action="/venue_health_check" method="GET">
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__control">
                <p className="boss-form__label boss-form__label_type_icon-venue">
                  <span className="boss-form__label-text">Choose Venue</span>
                </p>

                <div className="boss-form__select">
                  <select name="venue_id" id="filter-area" onChange={ this.redirectVenue.bind(this)}>
                    { this.dropdownOptions() }
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
