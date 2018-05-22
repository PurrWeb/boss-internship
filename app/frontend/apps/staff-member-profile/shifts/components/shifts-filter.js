import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import Select from 'react-select';
import URLSearchParams from 'url-search-params';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';

import { ColoredSingleOption, ColoredSingleValue } from '~/components/boss-form/colored-select';

class ShiftsFilter extends React.Component {
  constructor(props) {
    super(props);

    const pageOptions = oFetch(this.props, 'pageOptions');
    const startDate = oFetch(pageOptions, 'startDate');
    const endDate = oFetch(pageOptions, 'endDate');
    const venueId = oFetch(pageOptions, 'venueId');

    this.state = {
      focusedInput: null,
      startDate: safeMoment.uiDateParse(startDate),
      endDate: safeMoment.uiDateParse(endDate),
      venueId: venueId,
      updateClicked: false,
    };
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  };

  onVenueSelect = selection => {
    this.setState({ venueId: selection });
  };

  onUpdate = () => {
    this.setState({ updateClicked: true });
    const { venueId } = this.state;
    if (this.state.startDate && this.state.endDate) {
      const formatedStartDate = this.state.startDate.format('DD-MM-YYYY');
      const formatedEndDate = this.state.endDate.format('DD-MM-YYYY');
      this.props.onFilter({ start_date: formatedStartDate, end_date: formatedEndDate, venue_id: venueId });
      return;
    }
    this.props.onFilter({ venue_id: venueId });
  };

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    const venues = oFetch(this.props, 'venues');

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
                  options={venues}
                  onChange={this.onVenueSelect}
                  clearable
                  simpleValue
                  ignoreCase
                  valueKey="id"
                  labelKey="name"
                  optionComponent={ColoredSingleOption}
                  valueComponent={ColoredSingleValue}
                  placeholder={'Venue Name'}
                  value={this.state.venueId}
                  multi={false}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min">
              <button disabled={this.state.updateClicked} className="boss-button boss-form__submit" onClick={this.onUpdate}>
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
                  options={venues}
                  onChange={this.onVenueSelect}
                  clearable
                  ignoreCase
                  simpleValue
                  valueKey="id"
                  labelKey="name"
                  optionComponent={ColoredSingleOption}
                  valueComponent={ColoredSingleValue}
                  placeholder={'Venue Name'}
                  value={this.state.venueId}
                  multi={false}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_min">
                <button disabled={this.state.updateClicked} className="boss-button boss-form__submit" onClick={this.onUpdate}>
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
