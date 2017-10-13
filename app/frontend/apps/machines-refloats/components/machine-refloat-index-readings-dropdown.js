import React from 'react';
import MachinesReportsItemStat from './machines-reports-item-stat';

export default class MachineRefloatIndexReadingsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false
    }
  }

  readingsSectionOnClick(event) {
    //Toggle reading visibility
    this.setState({
      opened: !this.state.opened
    })
  }

  render(){
    return <div className="boss-report__dropdown">
      <div className="boss-report__dropdown-header">
          <h3 className="boss-report__subtitle boss-report__subtitle_role_readings">
            Readings
          </h3>
          <a className={`boss-report__dropdown-switch ${!this.state.opened && 'boss-report__dropdown-switch_state_closed'}`} onClick={this.readingsSectionOnClick.bind(this)}>Toggle Dropdown</a>
      </div>
      <div className={`boss-report__dropdown-content ${!this.state.opened && 'boss-report__dropdown-content_state_closed'}`}>
        <div className="boss-report__stats">
          <MachinesReportsItemStat
            statClasses="boss-report__stats-item_layout_table"
            labelClasses="boss-report__stats-text_size_m"
            label="Refill"
            value={this.props.refillReading}
          />
          <MachinesReportsItemStat
            statClasses="boss-report__stats-item_layout_table"
            labelClasses="boss-report__stats-text_size_m"
            label="Cash In"
            value={this.props.cashInReading}
          />
          <MachinesReportsItemStat
            statClasses="boss-report__stats-item_layout_table"
            labelClasses="boss-report__stats-text_size_m"
            label="Cash Out"
            value={this.props.cashOutReading}
          />
        </div>
      </div>
    </div>;
  }
}
