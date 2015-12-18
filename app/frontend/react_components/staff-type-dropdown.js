import React, { Component } from "react"
import _ from "underscore"

export default class StaffTypeDropdown extends Component {
    constructor(props) {
        super(props);
        this.value = null;
    }
    render(){
        var staffTypeOptions = _(this.props.staffTypes).mapValues(function(staffType){
            return <option key={staffType.id} value={staffType.id}>{staffType.title}</option>
        });
        staffTypeOptions = _.values(staffTypeOptions);

        var allOption = <option>All</option>;
        return (
            <select onChange={(e) => this.onChange(e)}>
                {allOption}
                {staffTypeOptions}
            </select>
        );
    }
    onChange(e){
        this.value = e.target.value;

        if (this.value === "All") {
            this.value = null;
        }

        this.props.onChange(this.value);
    }
}
