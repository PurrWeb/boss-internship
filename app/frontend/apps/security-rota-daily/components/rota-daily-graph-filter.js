import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import VenueSelect from '~/components/security-rota/venue-select';
import RotaFilter from '~/components/security-rota/security-rota-filter';
import RotaDayFilter from './rota-day-filter';

class RotaDailyGraphFilter extends React.Component {
  render() {
    return (
      <div className="boss-rotas__graphs-filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_desktop">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label boss-form__label_type_icon-filter">
                <span className="boss-form__label-text">Filter chart</span>
              </p>
              <VenueSelect
                selectedTypes={this.props.selectedTypes}
                venueTypes={this.props.venueTypes.toJS()}
                onChange={this.props.onVenueChange}
              />
            </div>
            <RotaFilter currentRotaDay={this.props.rotaDate} page="daily" />
          </div>
          <RotaDayFilter currentRotaDay={this.props.rotaDate} />
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_mobile boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label boss-form__label_type_icon-filter">
                <span className="boss-form__label-text">Filter chart</span>
              </p>
              <VenueSelect
                selectedTypes={this.props.selectedTypes}
                venueTypes={this.props.venueTypes.toJS()}
                onChange={this.props.onVenueChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RotaDailyGraphFilter.PropTypes = {
  onVenueChange: PropTypes.func.isRequired,
  selectedTypes: PropTypes.array.isRequired,
  venueTypes: PropTypes.array.isRequired,
  rotaDate: PropTypes.string.isRequired,
};

export default RotaDailyGraphFilter;
