import React, { Component } from 'react'
import StaffFilter from "./staff-finder/staff-filter.js"
import FilterableStaffList from "./staff-finder/filterable-staff-list.js"
import _ from "underscore"

export default class StaffFinder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staffFilterSettings: {
                name: "",
                staffTypes: []
            }
        }
    }
    render() {
        return <div>
            <div className="staff-finder__header">
                <h3 className="staff-finder__h3">
                    Find Staff
                </h3>
                <StaffFilter
                    onChange={(arg) => this.onFilterChange(arg)} />

            <FilterableStaffList
                staff={this.props.staff}
                filterSettings={this.state.staffFilterSettings} />
            </div>
        </div>
    }
    onFilterChange(filterSettings) {
        this.setState({staffFilterSettings: filterSettings});
    }
}
