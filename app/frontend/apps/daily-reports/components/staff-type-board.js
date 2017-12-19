import React from 'react';
import {Collapse} from 'react-collapse';
import oFetch from 'o-fetch';
import StaffMemberListing from './staff-member-listing';

class StaffTypeBoard extends React.Component {
  constructor(props) {
    super(props);
    const staffTypeSection = oFetch(props, 'staffTypeSection');
    const listingCount = oFetch(staffTypeSection, 'staffMemberListings').length;

    let listingExpandedValues = {};
    for(var index = 0; index < listingCount; index++) {
      listingExpandedValues[index] = false;
    }

    this.state = {
      sectionExpanded: false,
      listingsExpanded: listingExpandedValues
    };
  }

  toggleSectionHidden = () => {
    this.setState({
        sectionExpanded: !this.state.sectionExpanded
    });
  }

  renderListings(staffMemberListings){
    return staffMemberListings.map((staffMemberListing, index) => {
      return <StaffMemberListing key={index} staffMemberListing={staffMemberListing} />
    });
  }

  renderListing(options){


    return ;
  }

  render() {
    const staffTypeSection = oFetch(this.props, 'staffTypeSection');
    const staffTypeName = oFetch(staffTypeSection, 'staffTypeName');
    const staffTypeColor = oFetch(staffTypeSection, 'staffTypeColor');
    const roteadCostCents = oFetch(staffTypeSection, 'roteadCostCents');
    const actualCostCents = oFetch(staffTypeSection ,'actualCostCents');
    const staffMemberListings = oFetch(staffTypeSection, 'staffMemberListings');

    return <section className="boss-board boss-board_context_stack">
      <header className="boss-board__header boss-board__header_adjust_daily-reports">
        <h2 className="boss-board__title boss-board__title_size_medium">
          <span className="boss-button boss-button_type_small boss-button_type_no-behavior boss-board__title-label" style={{ backgroundColor: `#${staffTypeColor}` }}>{staffTypeName}</span>
          <span className="boss-board__title-text">
            <span className="boss-board__title-text">Rotaed Cost: <span className="boss-board__title-text-marked">{`£${roteadCostCents / 100.0}`}</span>,</span>
            <span className="boss-board__title-text">Actual Cost: <span className="boss-board__title-text-marked">{`£${actualCostCents / 100.0}`}</span></span>
          </span>
        </h2>
        <div className="boss-board__button-group" onClick={this.toggleSectionHidden}>
          <button type="button" className={`boss-board__switch ${this.state.sectionExpanded && "boss-board__switch_state_opened"}`}></button>
        </div>
      </header>
      <Collapse isOpened={this.state.sectionExpanded} hasNestedCollapse={true} className="boss-board__content" style={{display: 'block'}}>
        <div className="boss-board__content-inner">
          <div className="boss-board__table">
            <div className="boss-table boss-table_page_daily-reports">
              <div key={0} className="boss-table__row">
                <div className="boss-table__cell boss-table__cell_role_header">Name</div>
                <div className="boss-table__cell boss-table__cell_role_header">Pay rate</div>
                <div className="boss-table__cell boss-table__cell_role_header">Hours Rotaed</div>
                <div className="boss-table__cell boss-table__cell_role_header">Rotaed Cost</div>
                <div className="boss-table__cell boss-table__cell_role_header">Hours Worked</div>
                <div className="boss-table__cell boss-table__cell_role_header">Break Time (Hours)</div>
                <div className="boss-table__cell boss-table__cell_role_header">Actual Cost</div>
                <div className="boss-table__cell boss-table__cell_role_header"></div>
              </div>
              { this.renderListings(staffMemberListings) }
            </div>
          </div>
        </div>
      </Collapse>
    </section>
    ;
  }
}

export default StaffTypeBoard;
