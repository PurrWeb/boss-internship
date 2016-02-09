import React, { Component } from 'react'
import StaffTypeDropdown from "../staff-type-dropdown.js"

export default class StaffFilter extends Component {
    static getDefaultSettings() {
        return {
            name: "",
            staffTypes: []
        }
    }
    constructor(props) {
        super(props);
        this.state = StaffFilter.getDefaultSettings();
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
                        <input
                            onChange={(event) =>
                                this.setState(
                                    {name: event.target.value},
                                    () => this.handleChange()
                                )
                            }/>
                    </div>
                    <div className="col-md-2">
                        <StaffTypeDropdown
                            onChange={(staffTypes) => 
                                this.setState(
                                    {staffTypes: staffTypes},
                                    () => this.handleChange()
                                )
                            } />
                    </div>
                </div>
            </div>
        )
    }
    handleChange() {
        this.props.onChange(this.state);
    }
}
