import React, { Component } from "react"
import StaffFilter from "~components/staff-finder/staff-filter"
import FilterableStaffList from "~components/staff-finder/filterable-staff-list"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"
import _ from "underscore"

export default class StaffFinder extends Component {
    static propTypes = {
        staffItemComponent: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
            staffFilterSettings: StaffFilter.getDefaultSettings()
        }
    }
    render() {
        return <div>
            <StaffFilter
                staffTypes={this.getStaffTypesWithStaffMembers()}
                venues={this.props.venues}
                filters={this.props.filters}
                onChange={(arg) => this.onFilterChange(arg)}
                filterSettings={this.state.staffFilterSettings} />

            <FilterableStaffList
                staff={this.props.staff}
                staffItemComponent={this.props.staffItemComponent}
                filterSettings={this.state.staffFilterSettings} />
        </div>
    }
    getStaffTypesWithStaffMembers(){
        return getStaffTypesWithStaffMembers(this.props.staffTypes, this.props.staff);
    }
    onFilterChange(filterSettings) {
        this.setState({staffFilterSettings: filterSettings});
    }
}
