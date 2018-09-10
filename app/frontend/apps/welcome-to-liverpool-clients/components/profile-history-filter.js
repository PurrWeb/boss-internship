import React from 'react';
import PropTypes from 'prop-types';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import AsyncButton from 'react-async-button';
import utils from '~/lib/utils';

class ProfileHistoryFilter extends React.Component {
  state = {
    startDate: null,
    endDate: null,
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  };

  onUpdate = () => {
    const { startDate, endDate } = this.state;
    const formatedStartDate = startDate && startDate.format(utils.apiDateFormat);
    const formatedEndDate = endDate && endDate.format(utils.apiDateFormat);
    return this.props.onFilter(formatedStartDate, formatedEndDate);
  };

  render() {
    const { startDate, endDate } = this.state;
    return (
      <div className="boss-board__manager-filter">
        <div className="boss-form">
          <div className="boss-form__group boss-form__group_position_last">
            <h3 className="boss-form__group-title">Filter</h3>
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field boss-form__field_layout_max">
                <p className="boss-form__label">
                  <span className="boss-form__label-text">Revision date</span>
                </p>
                <div className="date-control date-control_type_icon date-control_type_interval">
                  <BossDateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onApply={this.onDatesChange}
                    startDateId="startDate"
                    endDateId="endDate"
                  />
                </div>
              </div>
              <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label boss-form__field_justify_mobile-center">
                <AsyncButton
                  text="Update"
                  pendingText="Updating..."
                  onClick={this.onUpdate}
                  className="boss-button boss-form__submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHistoryFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default ProfileHistoryFilter;
