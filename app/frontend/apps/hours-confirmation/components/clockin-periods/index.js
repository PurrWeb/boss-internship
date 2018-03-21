import React, { Component } from 'react';

class ClockInPeriods extends Component {
  renderPeriods(periods) {
    return periods.map((period, index) => {
      return React.cloneElement(this.props.periodRenderer(period), {
        key: index,
        index,
      });
    });
  }

  render() {
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
        </div>
      </div>
    );
  }
}

export default ClockInPeriods;
