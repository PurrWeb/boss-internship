import React, { Component } from "react"
import { connect } from "react-redux"
import utils from "../../lib/utils"
import _ from 'underscore'

class FilterableStaffList extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        staffItemComponent: React.PropTypes.func.isRequired,
        toShowNotes: React.PropTypes.bool,
        isNewDesign: React.PropTypes.bool,
        filterSettings: React.PropTypes.object.isRequired,
        newShiftSettings: React.PropTypes.shape({
            venueServerId: React.PropTypes.any.isRequired,
            venueClientId: React.PropTypes.any.isRequired,
            startsAt: React.PropTypes.instanceOf(Date).isRequired,
            endsAt: React.PropTypes.instanceOf(Date).isRequired,
            shiftType: React.PropTypes.string.isRequired
        })
    };
    getStaffListItems() {
        const staffToShow = this.getStaffToShow();
        const newShiftSettings = this.context.newShiftSettings;

        return this.props.isNewDesign ?
            staffToShow.map((staff, i) =>
                <this.props.staffItemComponent
                    key={staff.clientId}
                    staff={staff}
                    newShiftSettings={newShiftSettings}
                />
            ) :
            staffToShow.map((staff, i) =>
                <li key={staff.clientId}>
                    <this.props.staffItemComponent
                        key={staff.clientId}
                        staff={staff}
                        newShiftSettings={newShiftSettings}
                    />
                </li>
            );

    }
    getNewStyleTableContent() {
        const staffListItems = this.getStaffListItems();
        const notesCol = this.props.toShowNotes ? (
            <div className="info-table__th info-table__th_notes">notes</div>
        ) : null;

        return staffListItems.length ? (
            <div className="main-content__results-table-container">
                <div className="info-table">
                    <div className="info-table__header">
                        <div className="info-table__th info-table__th_name">name</div>
                        <div className="info-table__th info-table__th_rotaed">rotaed</div>
                        {notesCol}
                        <div className="info-table__th info-table__th_status">status</div>
                    </div>
                    {staffListItems}
                </div>
            </div>
        ) : (
            <div className="info-table__nothing-found-message">
                No Staff Members Found
            </div>
        );
    }
    getTableContent() {
        return this.props.isNewDesign ? this.getNewStyleTableContent() : this.getStaffListItems();
    }
    render() {
        const tableContent = this.getTableContent();

        return this.props.isNewDesign ? (
            <div className="main-content__results-table-container">
                {tableContent}
            </div>
        ) : (
            <ul className="no-bullet">
                {tableContent}
            </ul>
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
                return _(filter.staffTypes).contains(staff.staff_type.clientId);
            });
        }

        if (filter.venues.length > 0){
            staffToShow = _.filter(staffToShow, function(staff){
                var staffMemberVenueClientIds =  _.pluck(staff.venues, "clientId");
                var venuesMatchingFilter = _.intersection(filter.venues, staffMemberVenueClientIds);
                return venuesMatchingFilter.length > 0;
            });
        }

        if (filter.rotaedOrActive) {
            staffToShow = _.filter(staffToShow, function(staffMember){
                if (staffMember.isActive === undefined || staffMember.isRotaed === undefined) {
                    throw Error("isActive or isRotaed not defined on staff member object")
                }
                return staffMember.isActive || staffMember.isRotaed;
            });
        }

        staffToShow = _(staffToShow).sortBy(function(staffMember){
            return staffMember.first_name + " " + staffMember.surname
        })

        return staffToShow;
    }
}

function mapStateToProps(state, ownProps) {
    const userMode = state.clockInOutAppUserMode ? state.clockInOutAppUserMode.mode : '';
    const toShowNotes = (userMode === 'Manager' || userMode === 'Bar Supervisor' || userMode === 'GM');

    const additionalOpts = {
        toShowNotes
    };

    return Object.assign({}, ownProps, additionalOpts);
}

export default connect(mapStateToProps)(FilterableStaffList);
