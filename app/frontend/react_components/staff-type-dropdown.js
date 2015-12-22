import React, { Component } from "react"
import _ from "underscore"
import Select from "react-select"

export default class StaffTypeDropdown extends Component {
    constructor(props) {
        super(props);
        this.value = [];
    }
    render(){
        var staffTypeOptions = _(this.props.staffTypes).mapValues(function(staffType){
            return {
                value: staffType.id,
                label: staffType.title
            }
        })
        staffTypeOptions = _.values(staffTypeOptions);

        return (
            <Select
                value={this.value.join(",")}
                options={staffTypeOptions}
                multi={true}
                onChange={(value) => this.onChange(value)} />
        );
    }
    onChange(value){
        if (value === ""){
            this.value = [];
        } else {
            this.value = value.split(",");
        }
        this.props.onChange(this.value);
    }
}
