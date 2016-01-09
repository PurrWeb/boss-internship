import React, { Component } from "react"
import StaffFilter from "../staff-finder/staff-filter"
import StaffListItem from "../staff-finder/staff-list-item"
import FilterableStaffList from "../staff-finder/filterable-staff-list"

export default class StaffFinder extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            staffFilterSettings: StaffFilter.getDefaultSettings()
        };
    }
    render() {
        return <div>
            <StaffFilter
                onChange={(staffFilterSettings) => this.setState({staffFilterSettings})} />
            <FilterableStaffList
                staff={this.props.staff}
                staffItemComponent={StaffListItem}
                filterSettings={this.state.staffFilterSettings} />
        </div>

    }
}