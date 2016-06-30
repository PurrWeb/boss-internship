import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import utils from "~lib/utils"
import StaffListItem from "./index"
import {ContextProvider, NoOpComponent, simpleRender} from "~lib/test-helpers"
import {createStore} from "redux"
import AddShiftButton from "./add-shift-button"
import { getClientId } from "~lib/backend-data/process-backend-object"
import { processStaffMemberObject, processStaffTypeObject, processHolidayObject } from "~lib/backend-data/process-backend-objects"

describe('Rota StaffListItem', function() {
    beforeEach(function(){
        StaffListItem.__Rewire__('StaffTypeBadge', NoOpComponent);
        StaffListItem.__Rewire__('StaffHolidaysList', NoOpComponent);
        StaffListItem.__Rewire__('StaffShiftList', NoOpComponent);
    });
    afterEach(function(){
        StaffListItem.__ResetDependency__('StaffTypeBadge', NoOpComponent);
        StaffListItem.__ResetDependency__('StaffHolidaysList', NoOpComponent);
        StaffListItem.__ResetDependency__('StaffShiftList', NoOpComponent);
    })
    var staffMember = {
        first_name: "John",
        surname: "Doe",
        staff_type: {id: 3333},
        id: 33
    };
    staffMember = processStaffMemberObject(staffMember);

    var staffTypes = [{
        id: 3333,
        name: "Kitchen"
    }];
    staffTypes = staffTypes.map(processStaffTypeObject);

    var context = {
        newShiftSettings: {
            startsAt: new Date(2016,0,1,10,0),
            endsAt: new Date(2016,0,1,16,0),
            shiftType: "normal",
            venueServerId: 5,
            venueClientId: 5
        }
    };

    var storeState = {
        staffMembers: utils.indexByClientId([staffMember]),
        componentErrors: {},
        staffTypes: utils.indexByClientId(staffTypes),
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

        return findChild(AddShiftButton).props.canAddShift;
    }

    it("shows the person's first and last name", function(){
        var {getNode} = simpleRender(
            <StaffListItem staff={staffMember} />,
            { storeState, context }
        );

        expect(getNode().textContent).toContain("John");
        expect(getNode().textContent).toContain("Doe");
    });

    it("Enables the add button unless there's a reason not to", function(){
        expect(canAddShift(context, storeState, staffMember)).toBe(true);
    });

    it("Disables the add button if the staff member is on holiday", function(){
        var itemStoreState = {...storeState}

        var holiday = {
            start_date: new Date(2016,0,1),
            end_date: new Date(2016,0,1),
            id: 1,
            staff_member: {id: 33}
        };
        holiday = processHolidayObject(holiday);
        itemStoreState.holidays = utils.indexByClientId([holiday]);

        expect(canAddShift(context, itemStoreState, staffMember)).toBe(false);
    });

    it("Disables the add button if a shift is alrady being added", function(){
        var state = {...storeState};
        state.apiRequestsInProgress.ADD_SHIFT = [{
            staffMemberServerId: 33
        }]

        expect(canAddShift(context, state, staffMember)).toBe(false);
    });

    it("Disables the add button if the staff member's staff type can't be edited on this page", function(){
        var state = {...storeState};
        state.pageOptions = {
            disableEditingShiftsByStaffTypeName: {
                "Kitchen": true
            }
        };

        expect(canAddShift(context, state, staffMember)).toBe(false);
    })

    it("Disables the add button if the new shift times are invalid", function(){
        var itemContext = {...context};
        // end time is before start time
        itemContext.newShiftSettings = Object.assign({}, itemContext.newShiftSettings, {
            startsAt: new Date(2016,0,1,16,0),
            endsAt: new Date(2016,0,1,10,0)
        });
        expect(canAddShift(itemContext, storeState, staffMember)).toBe(false)
    })

});
