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

    it("shows the person's first and last name", function(){
        var {node} = simpleRender(
            <StaffListItem staff={staff} />,
            { storeState, context }
        );

        expect(node.textContent).toContain("John");
        expect(node.textContent).toContain("Doe");
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

        var { findChild } = simpleRender(
                <StaffListItem staff={itemStaff} />
        ,{
            context: itemContext,
            storeState: itemStoreState
        });

        var canAddShift = findChild(AddStaffToShiftButton).props.canAddShift;
        
        expect(canAddShift).toBe(false);
    });


});