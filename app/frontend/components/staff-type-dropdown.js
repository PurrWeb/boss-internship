import React, { Component } from "react"
import _ from "underscore"
import { connect } from "react-redux"
import Select from "react-select"
import { selectStaffTypesWithShifts } from "~redux/selectors"
import getArrayOfIdsFromReactSelectValue from "~lib/get-array-of-ids-from-react-select-value";
import cx from 'classnames';

export default class StaffTypeDropdown extends Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired
    }
    render(){
        var staffTypeOptions = _(this.props.staffTypes).mapValues(function(staffType){
            return {
                value: staffType.clientId,
                label: staffType.name,
                color: staffType.color
            }
        })
        staffTypeOptions = _.values(staffTypeOptions);
        const className = cx('staff-type-dropdown', this.props.className);
        return (
            <div className={className}>
                <Select
                    className="boss-react-select"
                    value={this.props.selectedStaffTypes.join(",")}
                    options={staffTypeOptions}
                    multi={true}
                    optionRenderer={(option) => this.renderOption(option, "option")}
                    valueRenderer={this.renderValue}
                    onChange={(value) => this.onChange(value)}
                />
            </div>
        );
    }
    renderValue(option) {
        const role = option.label.toLowerCase().replace(' ', '-');

        return (
            <div className={`Select-item-label__content Select-item-label__content_role_${role}`}>
                {option.label}
            </div>
        );
    }
    renderOption(option, itemType){
        const role = option.label.toLowerCase().replace(' ', '-');

        return <div className={`staff-type-dropdown__item staff-type-dropdown__item--option`}>
            <div
                className={`staff-type-dropdown__item-content boss-react-select__dropdown-option_role_${role}`}
            >
                {option.label}
            </div>
            {option.label}
        </div>
    }
    onChange(value){
        var value = getArrayOfIdsFromReactSelectValue(value);
        this.props.onChange(value);
    }
}