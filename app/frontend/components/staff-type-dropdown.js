import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"
import Select from "react-select"
import {  ColoredSingleOption, ColoredMultipleValue,} from '~/components/boss-form/colored-select';
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
        const containerClassName = cx('staff-type-dropdown ', this.props.className);
        const dropDownClassName = cx({'boss-react-select': this.props.isNewDesign});

        return (
                <div className="boss-form__select">
                    <Select
                        value={this.props.selectedStaffTypes.join(",")}
                        options={staffTypeOptions}
                        multi={true}
                        valueComponent={ColoredMultipleValue}
                        optionComponent={ColoredSingleOption}
                        onChange={(options) => {
                        const value = options.map((option, idx) => (idx ? ',' : '') + option.value);
                        this.onChange(value);
                        }}
                    />
                </div>
        );
    }
   
    onChange(value){
        var value = getArrayOfIdsFromReactSelectValue(value);
        this.props.onChange(value);
    }
}
