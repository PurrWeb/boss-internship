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

        return (
            <div className="staff-type-dropdown">
                <Select
                    value={this.value.join(",")}
                    options={staffTypeOptions}
                    multi={true}
                    optionRenderer={(option) => this.renderOption(option, "option")}
                    valueRenderer={(option) => this.renderOption(option, "value")}
                    onChange={(value) => this.onChange(value)} />
            </div>
        );
    }
    renderOption(option, itemType){
        return <div className={`staff-type-dropdown__item staff-type-dropdown__item--${itemType}`}>
            <div  style={{background: option.color}} className="staff-type-dropdown__item-content">
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
