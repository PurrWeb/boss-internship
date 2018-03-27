import React, { Component } from 'react';
import oFetch from 'o-fetch';

class ClockInPeriods extends Component {
  renderPeriods(periods) {
    return periods.map((period, index) => {
      return React.cloneElement(this.props.periodRenderer(period), {
        key: index,
        index,
      });
    });
  }

  areAllShiftsAccepted() {
    const unacceptedShifts = this.props.periods.filter(
      period => oFetch(period, 'status') === 'pending',
    );
    return unacceptedShifts.length === 0;
  }

  isPageTypeCurrent() {
    return this.props.pageType === 'current';
  }

  render() {
    const { periods } = this.props;
    return (
      <div>
        <div className="boss-hrc__shifts">
          {this.renderPeriods(this.props.periods)}
        </div>
        <div className="boss-hrc__controls">
          <button
            onClick={this.props.onAddNewAcceptancePeriod}
            className="boss-button boss-button_role_add boss-hrc__button boss-hrc__button_role_add"
          >
            Add shift
          </button>
          {this.areAllShiftsAccepted() &&
            this.isPageTypeCurrent() && (
              <button
                onClick={this.props.onDoneClick}
                className="boss-button boss-button_role_success boss-hrc__button"
              >
                Done
              </button>
            )}
        </div>
      </div>
    );
  }
}

export default ClockInPeriods;
