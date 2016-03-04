import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import StaffListItem from "./index"
import {ContextProvider, NoOpComponent, simpleRender} from "~lib/test-helpers"
import {createStore} from "redux"
import AddStaffToShiftButton from "./add-staff-to-shift-button"

StaffListItem.__Rewire__('StaffTypeBadge', NoOpComponent);
StaffListItem.__Rewire__('StaffHolidaysList', NoOpComponent);
StaffListItem.__Rewire__('StaffShiftList', NoOpComponent);

describe('StaffListItem', function() {
    var staff = {
        first_name: "John",
        surname: "Doe",
        staff_type: {id: 3333},
        id: 33
    };

    var context = {
        newShiftTimes: {
            starts_at: new Date(2016,0,1,10,0),
            ends_at: new Date(2016,0,1,16,0),
        },
        newShiftVenueId: 1
    };

    var storeState = {
        staff: {
            33: staff
        },
        componentErrors: {},
        staffTypes: {
            3333: {}
        },
        rotaShifts: {},
        apiRequestsInProgress: {},
        pageOptions: {}
    }

    function canAddShift(context, storeState, staffMember){
        var { findChild } = simpleRender(
                <StaffListItem staff={staffMember} />
        ,{
            context,
            storeState
        });

        return findChild(AddStaffToShiftButton).props.canAddShift;
    }

    it("shows the person's first and last name", function(){
        var {node} = simpleRender(
            <StaffListItem staff={staff} />,
            { storeState, context }
        );

        expect(node.textContent).toContain("John");
        expect(node.textContent).toContain("Doe");
    });

    it("Enables the add button unless there's a reason not to", function(){
        expect(canAddShift(context, storeState, staff)).toBe(true);
    });

    it("Disables the add button if the staff member is on holiday", function(){
        var itemContext = {...context};
        var itemStoreState = {...storeState}
        var itemStaff = {...staff}
        itemStaff.holidays = [{id: 1}]
        itemStoreState.staff = {
            33: itemStaff
        }
        itemStoreState.holidays = {
            1: {
                start_date: new Date(2016,0,1),
                end_date: new Date(2016,0,1),
                id: 1,
                staff_member: {id: 33}
            }
        }

        expect(canAddShift(itemContext, itemStoreState, itemStaff)).toBe(false);
    });

    it("Disables the add button if a shift is alrady being added", function(){
        var state = {...storeState};
        state.apiRequestsInProgress.ADD_SHIFT = [{
            shift: {
                staff_member_id: 33
            },
            venueId: 1
        }]

        expect(canAddShift(context, state, staff)).toBe(false);
    });

    

});