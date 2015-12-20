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
                staffType: null
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
                    staffTypes={this.props.staffTypes}
                    onChange={(arg) => this.onFilterChange(arg)} />

            <FilterableStaffList
                staff={this.props.staff}
                filterSettings={this.state.staffFilterSettings}
                rotaShifts={this.props.rotaShifts}
                addShift={this.props.addShift} />
            </div>
        </div>
    }
    onFilterChange(filterSettings) {
        this.setState({staffFilterSettings: filterSettings});
    }
}
