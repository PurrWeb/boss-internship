import React, { Component } from "react"
import StaffFilter from "../../staff-finder/staff-filter"
import ClockInOutStaffListItem from "./clock-in-out-staff-list-item"
import FilterableStaffList from "../../staff-finder/filterable-staff-list"

export default class StaffFinder extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            staffFilterSettings: StaffFilter.getDefaultSettings(),
        };
    }
    render() {
        return <div>
            <StaffFilter
                onChange={(staffFilterSettings) => this.setState({staffFilterSettings})} />
            <FilterableStaffList
                staff={this.props.staff}
                staffItemComponent={ClockInOutStaffListItem}
                filterSettings={this.state.staffFilterSettings} />
        </div>

    }
}