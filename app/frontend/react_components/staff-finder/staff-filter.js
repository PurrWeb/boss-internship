import React, { Component } from 'react'
import StaffTypeDropdown from "../staff-type-dropdown.js"

export default class StaffFilter extends Component {
    constructor(props) {
        super(props);
        this.ui = {};
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        Name
                    </div>
                    <div className="col-md-2">
                        Staff Type
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <input ref={(input) => this.ui.name = input} onChange={() => this.handleChange()}/>
                    </div>
                    <div className="col-md-2">
                        <StaffTypeDropdown
                            ref={(dropdown) => this.ui.staffType = dropdown}
                            staffTypes={this.props.staffTypes}
                            onChange={() => this.handleChange()} />
                    </div>
                </div>
            </div>
        )
    }
    handleChange() {
        var staffType = this.ui.staffType.value;

        var filterOptions = {
            name: this.ui.name.value,
            staffType: staffType
        };
        console.log(filterOptions)
        this.props.onChange(filterOptions);
    }
}
