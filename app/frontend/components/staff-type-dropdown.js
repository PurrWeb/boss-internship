import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"
import Select from "react-select"
import { selectStaffTypesWithShifts } from "~/redux/selectors"
import getArrayOfIdsFromReactSelectValue from "~/lib/get-array-of-ids-from-react-select-value";
import cx from 'classnames';

export default class StaffTypeDropdown extends Component {
    static propTypes = {
        staffTypes: PropTypes.object.isRequired,
        isNewDesign: PropTypes.bool
    };
    render(){
        var staffTypeOptions = _(this.props.staffTypes).mapValues(function(staffType){
            return {
                value: staffType.clientId,
                label: staffType.name,
                color: staffType.color
            }
        })
        staffTypeOptions = _.values(staffTypeOptions);
        const containerClassName = cx('staff-type-dropdown', this.props.className);
        const dropDownClassName = cx({'boss-react-select': this.props.isNewDesign});

        return (
            <div className={containerClassName}>
                <Select
                    className={dropDownClassName}
                    value={this.props.selectedStaffTypes.join(",")}
                    options={staffTypeOptions}
                    multi={true}
                    optionRenderer={(option) => this.renderOption(option, "option")}
                    valueRenderer={this.renderValue.bind(this)}
                    onChange={(options) => {
                      const value = options.map((option, idx) => (idx ? ',' : '') + option.value);
                      this.onChange(value);
                    }}
                />
            </div>
        );
    }
    renderValue(option) {
        if (this.props.isNewDesign) {
            const role = option.label.toLowerCase().replace(' ', '-');

            return (
                <div
                        className="Select-item-label__content"
                        style={{background: option.color}}
                >
                    {option.label}
                </div>
            );
        } else {
            return this.renderOption(option, "value");
        }
    }
    renderOption(option, itemType){
        if (this.props.isNewDesign) {
            const role = option.label.toLowerCase().replace(' ', '-');

            return <div className={`staff-type-dropdown__item staff-type-dropdown__item--option`}>
                <div
                        className="staff-type-dropdown__item-content"
                        style={{background: option.color}}
                >
                    {option.label}
                </div>
                {option.label}
            </div>
        } else {
            return <div className={`staff-type-dropdown__item staff-type-dropdown__item--${itemType}`}>
                <div style={{background: option.color}} className="staff-type-dropdown__item-content">
                    {option.label}
                </div>
                {option.label}
            </div>
        }
    }
    onChange(value){
        var value = getArrayOfIdsFromReactSelectValue(value);
        this.props.onChange(value);
    }
}
