import React from 'react';
import {Collapse} from 'react-collapse';
import oFetch from 'o-fetch';

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

  toggleSectionHidden(){
    this.setState({
        sectionExpanded: !this.state.sectionExpanded
    });
  }

  toggleMobileDetailsSectionShow(index){
    return () => {
      const index = oFetch(event.target, 'dataMobileSectionIndex');

      let mergeValue = {};
      mergeValue[index] = !this.state.listingsExpanded[index];

      this.setState({
        listingsExpanded: Object.assign({}, this.state.listingsExpanded, mergeValue)
      });
    }
  }

  renderListings(staffMemberListings){
    let index = 1;
    const result = staffMemberListings.map((staffMemberListing) => {
      let rowMarkup = this.renderListing({
        index: index,
        staffMemberListing: staffMemberListing
      });
      index = index + 1;
      return rowMarkup;
    });
    return result;
  }

  renderListing(options){
    const index = oFetch(options, 'index')
    const staffMemberListing = oFetch(options, 'staffMemberListing');

    const name = oFetch(staffMemberListing, 'fullName');
    const payRateString = oFetch(staffMemberListing, 'payrateDescription');
    const hoursRotaed = oFetch(staffMemberListing, 'rotaedHours');
    const rotaedCostCents = oFetch(staffMemberListing, 'rotaedCostCents');
    const rotaedCostString = `£${rotaedCostCents / 100.0}`;
    const hoursWorked = oFetch(staffMemberListing, 'workedHours');
    const breakTimeHours = oFetch(staffMemberListing, 'breakHours')
    const actualCostCents = oFetch(staffMemberListing, 'hourlyCostCents');
    const actualCostString = `£${actualCostCents / 100.0}`;
    const listingExpanded = oFetch(this.state, 'listingsExpanded')[index - 1];

    return <div key={index} className="boss-table__group">
      <div className="boss-table__row">
        <div className="boss-table__cell">{name}</div>
        <div className="boss-table__cell">{payRateString}</div>
        <div className="boss-table__cell">{hoursRotaed}</div>
        <div className="boss-table__cell">{rotaedCostString}</div>
        <div className="boss-table__cell">{hoursWorked}</div>
        <div className="boss-table__cell">{breakTimeHours}</div>
        <div className="boss-table__cell">{actualCostString}</div>
        <div className="boss-table__cell">
          <div className="boss-table__details-switch boss-table__details-switch_state_closed" onClick={this.toggleMobileDetailsSectionShow(index).bind(this)}>Toggle Details</div>
        </div>
      </div>
      <Collapse isOpened={listingExpanded}>
        <div className="boss-table__details boss-table__details_state_visible-mobile boss-table__details_state_closed">
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
    </div>;
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
        <div className="boss-board__button-group" onClick={this.toggleSectionHidden.bind(this)}>
          <button type="button" className={`boss-board__switch ${this.state.sectionExpanded && "boss-board__switch_state_opened"}`}></button>
        </div>
      </header>
      <Collapse isOpened={this.state.sectionExpanded} hasNestedCollapse={true} className="boss-board__content">
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