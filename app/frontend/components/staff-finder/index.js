import React, { Component } from "react"
import StaffFilter from "~components/staff-finder/staff-filter"
import FilterableStaffList from "~components/staff-finder/filterable-staff-list"
import { selectStaffTypesWithStaffMembers } from "~redux/selectors"
import _ from "underscore"

export default class StaffFinder extends Component {
    static propTypes = {
        staffItemComponent: React.PropTypes.func.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired
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
                onChange={(arg) => this.onFilterChange(arg)} />

            <FilterableStaffList
                staff={this.props.staff}
                staffItemComponent={this.props.staffItemComponent}
                filterSettings={this.state.staffFilterSettings} />
        </div>
    }
    getStaffTypesWithStaffMembers(){
        return selectStaffTypesWithStaffMembers(this.props.staffTypes, this.props.staff);
    }
    onFilterChange(filterSettings) {
        this.setState({staffFilterSettings: filterSettings});
    }
}
