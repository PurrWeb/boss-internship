import React, { Component } from "react"
import utils from "../../lib/utils"
import _ from 'underscore'

export default class FilterableStaffList extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        staffItemComponent: React.PropTypes.func.isRequired,
        filterSettings: React.PropTypes.object.isRequired
    }
    render() {
        var staffToShow = this.getStaffToShow();
        var self = this;
        var staffListItems = staffToShow.map(
            (staff, i) =>
                <this.props.staffItemComponent
                    key={staff.id}
                    staff={staff} />
        );

        return (
            <div>
                {staffListItems}
            </div>
        );
    }
    getStaffToShow() {
        var staffToShow = _.values(this.props.staff);
        var filter = this.props.filterSettings;

        if (filter.search !== "") {
            var lowercaseFilterName = filter.search.toLowerCase();
            staffToShow = _.filter(staffToShow, function(staff){
                var lowercaseFirstName = staff.first_name.toLowerCase();
                var lowercaseSurname = staff.surname.toLowerCase();
                var lowerCaseFullName = lowercaseFirstName + " " + lowercaseSurname;

                var isMatch = utils.stringStartsWith(lowercaseFirstName, lowercaseFilterName)
                    || utils.stringStartsWith(lowercaseSurname, lowercaseFilterName)
                    || utils.stringStartsWith(lowerCaseFullName, lowercaseFilterName);

                return isMatch;
            });
        }

        if (filter.staffTypes.length > 0) {
            staffToShow = _.filter(staffToShow, function(staff){
                return _(filter.staffTypes).contains(staff.staff_type.id);
            });
        }

        if (filter.venues.length > 0){
            staffToShow = _.filter(staffToShow, function(staff){
                return _(filter.venues).contains(staff.venue.id)
            });
        }

        return staffToShow;
    }
}
