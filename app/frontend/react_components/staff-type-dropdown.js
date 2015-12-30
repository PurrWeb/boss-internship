import React, { Component } from "react"
import _ from "underscore"
import Select from "react-select"

export default class StaffTypeDropdown extends Component {
    static contextTypes = {
        staffTypes: React.PropTypes.object
    }
    constructor(props) {
        super(props);
        this.value = [];
    }
    render(){
        var staffTypeOptions = _(this.context.staffTypes).mapValues(function(staffType){
            return {
                value: staffType.id,
                label: staffType.title,
                color: staffType.color
            }
        })
        staffTypeOptions = _.values(staffTypeOptions);

        var optionRenderer = this.renderOption.bind(this);

        return (
            <Select
                value={this.value.join(",")}
                options={staffTypeOptions}
                multi={true}
                optionRenderer={optionRenderer}
                valueRenderer={optionRenderer}
                onChange={(value) => this.onChange(value)} />
        );
    }
    renderOption(option){
        return <div className="staff-type-dropdown__value">
            <div  style={{background: option.color}} className="staff-type-dropdown__value--content">
                {option.label}
            </div>
            {option.label}
        </div>
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
