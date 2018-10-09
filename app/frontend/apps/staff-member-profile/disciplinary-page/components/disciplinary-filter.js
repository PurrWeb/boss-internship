import React from 'react';
import { DateRangePicker } from 'react-dates';
import PropTypes from 'prop-types';
import DisciplinaryFilterByType from './disciplinary-filter-by-type';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';

class DisciplinaryFilter extends React.Component {
  constructor(props) {
    super(props);
    const startDate = oFetch(props, 'startDate');
    const endDate = oFetch(props, 'endDate');
    this.state = {
      focusedInput: null,
      startDate: startDate ? safeMoment.uiDateParse(startDate) : null,
      endDate: endDate ? safeMoment.uiDateParse(endDate) : null,
      show: oFetch(props, 'show').toJS(),
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.startDate !== this.props.startDate ||
      prevProps.endDate !== this.props.endDate ||
      prevProps.show !== this.props.show
    ) {
      const startDate = oFetch(this.props, 'startDate');
      const endDate = oFetch(this.props, 'endDate');
      this.setState({
        startDate: startDate ? safeMoment.uiDateParse(startDate) : null,
        endDate: endDate ? safeMoment.uiDateParse(endDate) : null,
        show: oFetch(this.props, 'show').toJS(),
      });
    }
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  };

  handleTypeFilterChange = ({ show }) => {
    this.setState({
      show,
    });
  };

  handleUpdate = () => {
    let formatedStartDate;
    let formatedEndDate;
    const { show, startDate, endDate } = this.state;
    if (startDate && endDate) {
      formatedStartDate = startDate.format('DD-MM-YYYY');
      formatedEndDate = endDate.format('DD-MM-YYYY');
    } else {
      formatedStartDate = null;
      formatedEndDate = null;
    }
    this.props.onFilterUpdate({ startDate: formatedStartDate, endDate: formatedEndDate, show });
  };

  render() {
    const { focusedInput, startDate, endDate, show } = this.state;
    return (
      <div className="boss-board__manager-group boss-board__manager-group_role_data boss-board__manager-group_context_stack">
        <div className="boss-board__manager-filter">
          <div action="#" className="boss-form">
            <div className="boss-form__group boss-form__group_position_last">
              <h3 className="boss-form__group-title">Filter</h3>
              <div className="boss-form__row boss-form__row_position_last">
                <div className="boss-form__field boss-form__field boss-form__field_layout_max">
                  <p className="boss-form__label">
                    <span className="boss-form__label-text">Creation date</span>
                  </p>
                  <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
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
                <DisciplinaryFilterByType show={show} onFilterChange={this.handleTypeFilterChange} />
                <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label boss-form__field_justify_mobile-center">
                  <button onClick={this.handleUpdate} className="boss-button boss-form__submit">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DisciplinaryFilter.propTypes = {
  onFilterUpdate: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  show: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default DisciplinaryFilter;
