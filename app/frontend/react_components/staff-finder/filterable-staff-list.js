import React, { Component } from 'react'
import utils from "../../lib/utils.js"
import StaffListItem from "./staff-list-item.js"
import _ from 'underscore'

export default class FilterableStaffList extends Component {
    render() {
        var staffToShow = this.getStaffToShow();
        var self = this;
        var staffListItems = staffToShow.map(function(staff, i){
            return <StaffListItem
                rotaShifts={self.props.rotaShifts}
                key={i}
                staff={staff}
                addShift={self.props.addShift} />
        });

        return (
            <div>
                {staffListItems}
            </div>
        );
    }
    getStaffToShow() {
        var staffToShow = _.values(this.props.staff);
        var filter = this.props.filterSettings;

        if (filter.name !== "") {
            var lowercaseFilterName = filter.name.toLowerCase();
            staffToShow = _.filter(staffToShow, function(staff){
                var lowercaseFirstName = staff.first_name.toLowerCase();
                var lowercaseSurname = staff.surname.toLowerCase();

                var isMatch = utils.stringStartsWith(lowercaseFirstName, lowercaseFilterName)
                    || utils.stringStartsWith(lowercaseSurname, lowercaseFilterName);

                return isMatch;
            });
        }

        if (filter.staffTypes.length > 0) {
            staffToShow = _.filter(staffToShow, function(staff){
                return _(filter.staffTypes).contains(staff.staff_type);
            });
        }

        return staffToShow;
    }
}
