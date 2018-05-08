import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import Select from 'react-select';
import URLSearchParams from 'url-search-params';
import safeMoment from '~/lib/safe-moment';

import { ColoredSingleOption, ColoredSingleValue } from '~/components/boss-form/colored-select';

class ShiftsFilter extends React.Component {
  constructor(props) {
    super(props);
    const queryString = new URLSearchParams(window.location.search);

    const startDate = queryString.get('startDate');
    const endDate = queryString.get('endDate');
    const venueId = queryString.get('venueId');

    this.state = {
      focusedInput: null,
      startDate: startDate ? safeMoment.uiDateParse(startDate) : undefined,
      endDate: endDate ? safeMoment.uiDateParse(endDate) : undefined,
      venueId: venueId ? Number(venueId) : undefined,
    };
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  };

  onVenueSelect = selection => {
    this.setState({ venueId: selection ? selection.value : null });
  };

  onUpdate = () => {
    const { venueId } = this.state;
    if (this.state.startDate && this.state.endDate) {
      const formatedStartDate = this.state.startDate.format('DD-MM-YYYY');
      const formatedEndDate = this.state.endDate.format('DD-MM-YYYY');
      this.props.onFilter({ startDate: formatedStartDate, endDate: formatedEndDate, venueId });
      return;
    }
    this.props.onFilter({ venueId });
  };

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const venueOptions = this.props.venues.map(venue => ({ value: venue.id, label: venue.name }));
    return (
      <div className="boss-board__manager-filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_align_center boss-form__row_desktop">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_max">
              <p className="boss-form__label boss-form__label_type_light">
                <span className="boss-form__label-text">Filter</span>
              </p>
              <div className="date-range-picker date-range-picker_type_interval date-range-picker_type_icon">
                <DateRangePicker
                  numberOfMonths={1}
                  withPortal
                  showClearDates
                  isOutsideRange={() => false}
                  displayFormat={'DD-MM-YYYY'}
                  startDate={startDate}
                  keepOpenOnDateSelect={false}
                  endDate={endDate}
                  onDatesChange={this.onDatesChange}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min">
              <div className="boss-form__select boss-form__select_size_small">
                <Select
                  options={venueOptions}
                  onChange={this.onVenueSelect}
                  clearable
                  ignoreCase
                  optionComponent={ColoredSingleOption}
                  valueComponent={ColoredSingleValue}
                  placeholder={'Venue Name'}
                  value={this.state.venueId}
                  multi={false}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min">
              <button className="boss-button boss-form__submit" onClick={this.onUpdate}>
                Update
              </button>
            </div>
          </div>
          <div className="boss-form__row boss-form__row_mobile">
            <div className="boss-form__field boss-form__field_layout_max">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Filter </span>
              </p>
              <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
                <DateRangePicker
                  numberOfMonths={1}
                  withPortal
                  showClearDates
                  isOutsideRange={() => false}
                  displayFormat={'DD-MM-YYYY'}
                  startDate={startDate}
                  endDate={endDate}
                  onDatesChange={this.onDatesChange}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min">
              <div className="boss-form__select">
                <Select
                  options={venueOptions}
                  onChange={this.onVenueSelect}
                  clearable
                  ignoreCase
                  optionComponent={ColoredSingleOption}
                  valueComponent={ColoredSingleValue}
                  placeholder={'Venue Name'}
                  value={this.state.venueId}
                  multi={false}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_min">
                <button className="boss-button boss-form__submit" onClick={this.onUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShiftsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default ShiftsFilter;
