import React, { Component } from "react"
import StaffFilter from "../staff-finder/staff-filter"

export default class StaffFinder extends Component {
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
            {JSON.stringify(this.state.staffFilterSettings)}
        </div>
    }
}