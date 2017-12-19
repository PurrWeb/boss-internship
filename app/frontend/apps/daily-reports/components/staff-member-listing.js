import React from 'react';
import oFetch from 'o-fetch';
import {Collapse} from 'react-collapse';

class StaffMemberListing extends React.Component {
  state = {
    isOpened: false,
  }

  toggleMobileDetailsSectionShow = () => {
    this.setState(state => ({isOpened: !state.isOpened}));
  }

  render() {
    const staffMemberListing = oFetch(this.props, 'staffMemberListing');

    const name = oFetch(staffMemberListing, 'fullName');
    const payRateString = oFetch(staffMemberListing, 'payrateDescription');
    const hoursRotaed = oFetch(staffMemberListing, 'rotaedHours');
    const rotaedCostCents = oFetch(staffMemberListing, 'rotaedCostCents');
    const rotaedCostString = `£${rotaedCostCents / 100.0}`;
    const hoursWorked = oFetch(staffMemberListing, 'workedHours');
    const breakTimeHours = oFetch(staffMemberListing, 'breakHours')
    const actualCostCents = oFetch(staffMemberListing, 'hourlyCostCents');
    const actualCostString = `£${actualCostCents / 100.0}`;

    return (
      <div className="boss-table__group">
        <div className="boss-table__row">
          <div className="boss-table__cell">{name}</div>
          <div className="boss-table__cell">{payRateString}</div>
          <div className="boss-table__cell">{hoursRotaed}</div>
          <div className="boss-table__cell">{rotaedCostString}</div>
          <div className="boss-table__cell">{hoursWorked}</div>
          <div className="boss-table__cell">{breakTimeHours}</div>
          <div className="boss-table__cell">{actualCostString}</div>
          <div className="boss-table__cell">
            <div className="boss-table__details-switch boss-table__details-switch_state_closed" onClick={this.toggleMobileDetailsSectionShow}>Toggle Details</div>
          </div>
        </div>
        <Collapse isOpened={this.state.isOpened}>
          <div className="boss-table__details boss-table__details_state_visible-mobile boss-table__details_state_closed" style={{display: 'block'}}>
            <div className="boss-table__details-inner">
              <div className="boss-table__details-item">
                <p className="boss-table__details-label">Pay rate</p>
                <p className="boss-table__details-value">{payRateString}</p>
              </div>
              <div className="boss-table__details-item">
                <p className="boss-table__details-label">Hours Rotaed</p>
                <p className="boss-table__details-value">{hoursRotaed}</p>
              </div>
              <div className="boss-table__details-item">
                <p className="boss-table__details-label">Rotaed Cost</p>
                <p className="boss-table__details-value">{rotaedCostString}</p>
              </div>
              <div className="boss-table__details-item">
                <p className="boss-table__details-label">Hours Worked</p>
                <p className="boss-table__details-value">{hoursWorked}</p>
              </div><div className="boss-table__details-item">
                <p className="boss-table__details-label">Break Time (Hours)</p>
                <p className="boss-table__details-value">{breakTimeHours}</p>
              </div><div className="boss-table__details-item">
                <p className="boss-table__details-label">Actual Cost</p>
                <p className="boss-table__details-value">{actualCostString}</p>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}

export default StaffMemberListing;
