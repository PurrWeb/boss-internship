import React from 'react';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import moment from 'moment';

class AccessoriesFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mPayslipStartDate: oFetch(props, 'mPayslipStartDate'),
      mPayslipEndDate: oFetch(props, 'mPayslipEndDate'),
    };
  }

  onPayslipDatesChange = ({ startDate, endDate }) => {
    this.setState({
      mPayslipStartDate: startDate,
      mPayslipEndDate: endDate,
    });
  };

  onUpdate = () => {
    const { mPayslipStartDate, mPayslipEndDate } = this.state;
    if (mPayslipStartDate && mPayslipEndDate) {
      return this.props.onFilter({
        mPayslipStartDate,
        mPayslipEndDate,
      });
    }
  };

  render() {
    const { mPayslipStartDate, mPayslipEndDate } = this.state;

    return (
      <div className="boss-board__manager-filter">
        <div className="boss-form">
          <div className="boss-form__group boss-form__group_position_last">
            <h3 className="boss-form__group-title">Filter</h3>
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field boss-form__field_layout_max">
                <p className="boss-form__label">
                  <span className="boss-form__label-text">Payslip date</span>
                </p>
                <div className="date-control date-control_type_icon date-control_type_interval-fluid">
                  <BossDateRangePicker
                    startDateId="payslipStartDate"
                    endDateId="payslipEndDate"
                    startDate={mPayslipStartDate}
                    endDate={mPayslipEndDate}
                    onApply={this.onPayslipDatesChange}
                  />
                </div>
              </div>
              <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label boss-form__field_justify_mobile-center">
                <AsyncButton
                  className="boss-button boss-form__submit"
                  text="Update"
                  pendingText="Updating..."
                  onClick={this.onUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AccessoriesFilter.propTypes = {
  mPayslipStartDate: PropTypes.instanceOf(moment),
  mPayslipEndDate: PropTypes.instanceOf(moment),
  onFilter: PropTypes.func.isRequired,
};

export default AccessoriesFilter;
