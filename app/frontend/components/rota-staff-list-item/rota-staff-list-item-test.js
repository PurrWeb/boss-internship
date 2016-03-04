import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import expect from "expect"
import StaffListItem from "./index"
import {ContextProvider, NoOpComponent} from "~lib/test-helpers"
import {createStore} from "redux"

StaffListItem.__Rewire__('StaffTypeBadge', NoOpComponent);
StaffListItem.__Rewire__('AddStaffToShiftButton', NoOpComponent);
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
            starts_at: new Date(),
            ends_at: new Date()
        },
        newShiftVenueId: 1,
        store: createStore(function(){
            return {
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
        })
    };

    it("shows the person's first and last name", function(){
        var item = TestUtils.renderIntoDocument(
            <ContextProvider context={context}>
                <StaffListItem staff={staff} />
            </ContextProvider>
        );

        var itemNode = ReactDOM.findDOMNode(item);

        expect(itemNode.textContent).toContain("John");
        expect(itemNode.textContent).toContain("Doe");
    });
});